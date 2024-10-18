// FolderStructure.js
import React, { useEffect, useState } from 'react';
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const FolderStructure = ({ data, onFileClick }) => {
    const [folders, setFolders] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('http://localhost:5000/folder-structure');
            const json = await response.json();
            setFolders(json);
        };

        fetchData();
    }, []);

    const renderFolders = (folders) => {
        return folders.map((folder, index) => (
            <Accordion key={index}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{folder.name}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {folder.type === 'folder' ? (
                        <List>
                            {folder.children.map((child, childIndex) => {
                                if (child.type === 'folder') {
                                    return renderFolders([child]); // Recursively render subfolders
                                }
                                return (
                                    <ListItem button key={childIndex} onClick={() => onFileClick(child)}>
                                        <ListItemText primary={child.name} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : null}
                </AccordionDetails>
            </Accordion>
        ));
    };

    return <div>{renderFolders(folders)}</div>;
};

export default FolderStructure;
