import { useState, useEffect } from "react";

type Contact = {
    _id?: string;
    name:string;
    email:string;
    phone:string;
    message?:string;
}

type Props = {
    onSave: (contact:Contact) => void;
    editingContact?:Contact| null;
    onCancel?:() => void;
}

export default function ContactForm({ onSave, editingContact, onCancel}:Props){
    const [contact, setContact] = useState<Contact>({
        name:'',
        email:'',
        phone:'',
        message:''
    })

    useEffect(()=>{
        if (editingContact)setContact(editingContact);
    }, [editingContact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setContact(prev => ({ ...prev, [name]: value }));
    }

    const handlesubmit = (e: React.FormEvent)=>{
        e.preventDefault();
        if (!contact.name || !contact.email || !contact.phone) {
            alert("Please fill in all required fields.");
            return;
        }
        onSave(contact);
        setContact({ name: '', email: '', phone: '', message: '' });
    }

    return(
        <form onSubmit={handlesubmit}
        className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <h2 className="text-2xl font-semibold mb-4">
                {editingContact ? "Edit Contact" : "Add New Contact"}
            </h2>

            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                <input 
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                    required
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                <input 
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email"
                    required
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Phone</label>
                <input 
                    type="text"
                    name="phone"
                    value={contact.phone}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                    required
                />
            </div>
            <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">Message</label>
                <textarea 
                    name="message"
                    value={contact.message}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter message"
                    rows={4}
                    required
                />
            </div>
            <div className="flex justify-end gap-4">
                {editingContact && onCancel &&(
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                    >Cancel
                    </button>
                )}
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    {editingContact ? "Update Contact" : "Add Contact"}
                </button>
            </div>
        </form>
    )
}