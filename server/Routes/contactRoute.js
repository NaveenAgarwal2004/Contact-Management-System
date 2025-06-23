import express from 'express';
import Contact from '../model/Contact.js';

const router = express.Router();
router.get('/',async(__dirname, res)=>{
    const contacts = await Contact.find().sort({createdAt: -1})
    res.status(200).json(contacts);
})

// Create a new contact

router.post('/',async(req, res)=>{
    try{
        const newContact = await Contact.create(req.body);
        res.status(200).json(newContact);
    }catch(err){
        res.status(400).json({error: err.message});
    }
})

// Delete a contact
router.delete('/:id', async(req,res)=>{
    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({message: 'Contact deleted successfully'});
})

// Update a contact

router.put('/:id',async(req,res)=>{
    const updated =  await Contact.findByIdAndUpdate(req.params.id, req.body,{new:true});
    res.status(200).json(updated);
})

export default router;