import React from 'react';
import '../style/operation-policy.css';

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
        <div className="operation-policy">
            <h2 className="operation-policy-title">{title}</h2>
            <ul className="operation-policy-list">
                {policyData.map((item, index) => (
                    item.value && (
                        <li key={index} className="operation-policy-item">
                            <span className="policy-label">{item.label}</span>
                            <span className={`policy-value ${
                                item.label === '인원' ? item.className || '' : ''
                            }`}>
                                {item.value}
                            </span>
                        </li>
                    )
                ))}
            </ul>
        </div>
    );
};

export default OperationPolicy;