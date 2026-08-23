import express from 'express';

import { signupPostRequestSchema , loginPostRequestSchema} from '../validation/request.validation.js';

import {hashPasswordWithSalt } from '../utils/hash.js';

import { getUserByEmail, createUser } from "../services/user.service.js";

import {createUserToken} from '../utils/token.js';

const router = express.Router();


router.post('/signup', async (req, res) => {
    const validationResult = await signupPostRequestSchema.safeParseAsync(req.body);

    if (validationResult.error){
        return res.status(400).json({ error: validationResult.error.format() });
    }   

    const { firstName, lastName, email, password } = validationResult.data;

    // Check if the user already exists
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return res.status(400).json({ error: `User with email ${email} already exists!` });
    }
    
    // Hash the password with a salt
    const { salt, password: hashedPassword } = hashPasswordWithSalt(password);

    // Create the user in the database
    const user = await createUser({ firstName, lastName, email, password: hashedPassword, salt });

    return res.status(201).json({data: {userId: user.id }})
});


router.post('/login', async (req, res) => {
    const validationResult = await loginPostRequestSchema.safeParseAsync(req.body);

    if (validationResult.error){
        return res.status(400).json({ error: validationResult.error });
    }

    const { email, password} = validationResult.data;

    const user = await getUserByEmail(email);

    if(!user){
        return res.status(404).json({error: `User with email ${email} not found!`});
    }

    const { password: hashedPassword } = hashPasswordWithSalt(password, user.salt);

    if (hashedPassword !== user.password) {
        return res.status(401).json({ error: 'Invalid password' });
    };
    
    const token = await createUserToken({ id: user.id });
    
    return res.json({ token });
});

export default router;