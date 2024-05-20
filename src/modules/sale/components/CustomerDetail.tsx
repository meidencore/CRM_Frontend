import React, { useState } from 'react';
import { ClientDetail } from '@/types/auth';
import { User, Mail, Phone, Home, ChevronDown } from 'lucide-react';

interface CustomerDetailProps {
    customer: ClientDetail | null;
    isLoading: boolean;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, isLoading }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    if (isLoading) {
        return <p>Cargando detalles del cliente...</p>;
    }

    if (!customer) {
        return <p>No se encontraron detalles del cliente.</p>;
    }

    return (
        <div className="space-y-1 mb-2 rounded-xl border p-4 hover:border-foreground">
            <div className="flex items-center justify-between">
                <p className="font-bold text-lg cursor-pointer" onClick={handleToggle}>Datos del cliente</p>
                <div className="bg-transparent hover:bg-muted rounded-full p-1 transform transition-transform hover:scale-100 active:scale-50" onClick={handleToggle} style={{ transition: 'transform 0.3s ease' }}>
                    <ChevronDown className={`h-6 w-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <>
                    <p className="text-sm text-muted-foreground"><User className="inline-block mr-2 h-4" />{customer.name} {customer.lastname}</p>
                    <p className="text-sm text-muted-foreground"><Mail className="inline-block mr-2 h-4" />{customer.email}</p>
                    <p className="text-sm text-muted-foreground"><Phone className="inline-block mr-2 h-4" />{customer.phone}</p>
                    <p className="text-sm text-muted-foreground"><Home className="inline-block mr-2 h-4"/>{customer.address}</p>
                </>
            )}
        </div>
    );
}

export default CustomerDetail;