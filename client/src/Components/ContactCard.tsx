import { FaEnvelope, FaPhone, FaTrash, FaEdit, FaCommentDots, FaCalendar } from 'react-icons/fa';

type Contact = {
    _id: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    createdAt?: string;
}

type Props ={
    contact: Contact;
    onDelete: (id: string) => void;
    onEdit: (contact: Contact) => void;
    onMessage: (contact: Contact) => void;
}

export default function ContactCard({ contact, onDelete, onEdit, onMessage }: Props) {
    return(
        <div className='bg-white p-4 rounded-xl shadow-md flex gap-4 hover:shadow-lg transition-shadow duration-200'>
            <img
        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random&size=128`}
        alt={contact.name}
        className="w-16 h-16 rounded-full object-cover"
            />
            <div className='flex-1 space-y-1'>
                <h2 className='text-lg font-semibold'>{contact.name}</h2>
                <p className='text-sm text-gray-600 flex items-center gap-2'><FaEnvelope/>{contact.email}</p>
                <p className="text-sm text-gray-600 flex items-center gap-2"><FaPhone /> {contact.phone}</p>
                {contact.message && (
                <p className="text-sm text-gray-600 flex items-center gap-2"><FaCommentDots /> {contact.message}</p>
                )}
                {contact.createdAt && (
                <p className="text-xs text-gray-400 flex items-center gap-2"><FaCalendar /> {new Date(contact.createdAt).toLocaleString()}</p>
                )}
            </div>
            <div  className='flex flex-col gap-2'>
                <button
                    onClick={() => onEdit(contact)}
                    className='text-blue-500 hover:text-blue-700 transition-colors'
                >
                    <FaEdit className='inline' /> Edit
                </button>
                <button
                    onClick={() => onMessage(contact)}
                    className='text-green-500 hover:text-green-700 transition-colors'
                >
                    <FaCommentDots className='inline' /> Message
                </button>
                <button
                    onClick={() => onDelete(contact._id)}
                    className='text-red-500 hover:text-red-700 transition-colors'
                >
                    <FaTrash className='inline' /> Delete
                </button>
            </div>
        </div>
    )
}