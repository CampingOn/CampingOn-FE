import React from 'react';
import '../style/operation-policy.css'; // 스타일 분리

const OperationPolicy = ({ industries, outdoorFacility }) => {
    const policyData = [
        { label: '매너타임', value: '시작 22:00 | 종료 07:00' },
        { label: '오토캠핑', value: '입실 14:00 | 퇴실 11:00' },
        { label: '글램핑', value: '입실 14:00 | 퇴실 11:00' },
    ];

    // 부대시설과 업종 정보를 추가로 병합
    if (outdoorFacility) {
        policyData.push({ label: '부대시설', value: outdoorFacility });
    }

    if (industries && industries.length > 0) {
        const industriesValue = industries.join(', ');
        policyData.push({ label: '업종', value: industriesValue });
    }

    return (
        <div className="operation-policy">
            <h2 className="operation-policy-title">운영정책</h2>
            <ul className="operation-policy-list">
                {policyData.map((item, index) => (
                    <li key={index} className="operation-policy-item">
                        <span className="policy-label">{item.label}</span>
                        <span className="policy-value">{item.value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OperationPolicy;