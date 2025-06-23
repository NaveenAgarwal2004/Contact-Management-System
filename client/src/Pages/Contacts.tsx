import { useState, useEffect } from "react";
import axios from "axios";
import ContactCard from "../Components/ContactCard";
import ContactForm from "../Components/ContactForm";

type Contact ={
    _id?: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    createdAt?: string;
}

export default function Contacts(){
    const [contacts , setContacts] = useState<Contact[]>([]);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchContacts = async () => {
        setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/api/contacts');
      setContacts(res.data);
    } catch (err) {
      console.error('Error fetching contacts', err);
    }
    setLoading(false);
  };
    const handleSave = async (contact : Contact) =>{
        try{
            if(contact._id){
                // Update existing contact
                const res = await axios.put(`http://localhost:5000/api/contacts/${contact._id}`, contact);
                setContacts(contacts.map(c=>(c._id === contact._id ? res.data : c)))
            }else{
                // Create new contact
                const res = await axios.post('http://localhost:5000/api/contacts', contact);
                setContacts([res.data, ...contacts]);                               
            }
            setEditingContact(null);
        }catch(err){
            console.error('Error saving contact', err);
        }
    }

    const handleDelete = async (id:string)=>{
        try{
            await axios.delete(`http://localhost:5000/api/contacts/${id}`);
            setContacts(contacts.filter(c=>c._id !==id));
        }catch(err){
            console.error('Error deleting contact', err);
        }
    }

    const handleEdit = (contact: Contact) => {
        setEditingContact(contact);
        window.scrollTo({top: 0, behavior: 'smooth'});
    }

    useEffect(() => {
        fetchContacts();
    }, []);

    return(
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <ContactForm
                onSave={handleSave}
                editingContact={editingContact}
                onCancel={() => setEditingContact(null)}
            />

            <hr />

            {loading ? (
                <p>Loading Contacts ....</p>
            ):contacts.length === 0 ? (
                <p className="text-gray-500">
                    No contacts found.{' '}
                </p>
            ):(
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {contacts.map(contact =>(
                        <ContactCard
                            key={contact._id}
                            contact={contact}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            onMessage={() => alert(`Messaging ${contact.name}`)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}