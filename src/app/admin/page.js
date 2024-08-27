'use client';

import React, { useState, useEffect } from 'react';
import { List, Typography, TextField, InputAdornment } from '@mui/material';
import { getCurrent, getList, create } from '@/actions';
import ListItem from '@/components/ListItem';
import AddAvisButton from '@/components/AddAvisButton';
import Avis from '@/components/Avis';
import AvisEmpty from '@/components/AvisEmpty';
import SearchIcon from '@mui/icons-material/Search';
import EditAvis from '@/components/EditAvis';

function Heading({ children, ...props }) {
    return (
        <Typography variant='h6' mb={2} {...props}>
            {children}
        </Typography>
    );
}

export default function DashboardPage() {
    const [current, setCurrent] = useState(null);
    const [data, setData] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const [currentResponse, dataResponse] = await Promise.all([getCurrent(), getList()]);
            setCurrent(currentResponse);
            setData(dataResponse);
        };

        fetchData();
    }, []);

    const handleSearchChange = (event) => {
        setSearchKeyword(event.target.value);
    };

    const refreshData = async () => {
        const [currentResponse, dataResponse] = await Promise.all([getCurrent(), getList()]);
        setCurrent(currentResponse);
        setData(dataResponse);
    };

    const handleAddAvis = async () => {
        try {
            const newAvis = { message: '', active: false }; // Créez un nouvel avis avec les valeurs par défaut
            const result = await create(newAvis);

            if (result.success) {
                // Mettez à jour l'avis avec l'id attribué par l'API
                newAvis.id = result.data.id;
                setData([newAvis, ...data]); // Ajoutez le nouvel avis à votre liste locale
            } else {
                console.error('Erreur lors de la création de l\'avis:', result.message);
            }
        } catch (error) {
            console.error('Erreur lors de la création de l\'avis:', error);
        }
    };

    const filteredData = data.filter((avis) =>
        avis.message?.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    return (
        <>
            <Heading>Message actif </Heading>
            {current && current.success ? (
                current.data ? (
                    <Avis key={current.data.id} avis={current.data} onDelete={refreshData} onSetActive={refreshData} />
                ) : (
                    <AvisEmpty>Aucun avis actif en ce moment.</AvisEmpty>
                )
            ) : (
                <AvisEmpty>Erreur de chargement de l'avis.</AvisEmpty>
            )}

            <Heading mt={4}>Banque de messages</Heading>

            <TextField
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchKeyword}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon color={searchKeyword ? 'orange' : 'disabled'} />
                        </InputAdornment>
                    ),
                    placeholder: 'Recherche par mot-clé',
                }}
            />
            <List sx={{ p: 0 }}>
                {filteredData.length > 0 ? (
                    filteredData.map((avis) => (
                        <ListItem
                            key={avis.id}
                            avis={avis}
                            onDelete={refreshData}
                            onStateChange={refreshData}
                        />
                    ))
                ) : (
                    <AvisEmpty>Aucun message trouvé.</AvisEmpty>
                )}
            </List>

            <AddAvisButton onClick={handleAddAvis} />
        </>
    );
}

