import React from 'react';
import { Box, Typography, List, ListItem } from '@mui/material';

const OperationPolicy = ({ 
    additionalPolicies = [], 
    title = '운영정책', 
    showDefaultPolicies = true,
    outdoorFacility,
    industries
}) => {
    const policyData = [];

    if (showDefaultPolicies) {
        const defaultPolicies = [
            { label: '매너타임', value: '시작 22:00 | 종료 07:00' },
            { label: '오토캠핑', value: '입실 14:00 | 퇴실 11:00' },
            { label: '글램핑', value: '입실 14:00 | 퇴실 11:00' },
        ];
        policyData.push(...defaultPolicies);
    }

    if (outdoorFacility) {
        policyData.push({ label: '부대시설', value: outdoorFacility });
    }

    if (industries && industries.length > 0) {
        const industriesValue = industries.join(', ');
        policyData.push({ label: '업종', value: industriesValue });
    }

    policyData.push(...additionalPolicies);

    return (
        <Box sx={{
            width: '100%',
            maxWidth: '100%',
            padding: '20px',
            marginTop: '20px',
            marginBottom: '20px',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '8px',
            border: '1px solid #000000',
            bgcolor: 'background.paper'
        }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                {title}
            </Typography>
            <List sx={{ p: 0 }}>
                {policyData.map((item, index) => (
                    item.value && (
                        <ListItem 
                            key={index}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                py: 1,
                                borderBottom: index === policyData.length - 1 ? 'none' : '1px solid #f0f0f0'
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', color: '#333' }}>
                                {item.label}
                            </Typography>
                            <Typography sx={{ color: '#666' }}>
                                {item.value}
                            </Typography>
                        </ListItem>
                    )
                ))}
            </List>
        </Box>
    );
};

export default OperationPolicy;