import React from 'react';
import StaffModal from './StaffModal';
import PartnerModal from './PartnerModal';

interface DashboardModalsProps {
  staffMember: any;
  partner: any;
  onCloseStaff: () => void;
  onClosePartner: () => void;
}

export default function DashboardModals({
  staffMember,
  partner,
  onCloseStaff,
  onClosePartner,
}: DashboardModalsProps) {
  return (
    <>
      <StaffModal staffMember={staffMember} onClose={onCloseStaff} />
      <PartnerModal partner={partner} onClose={onClosePartner} />
    </>
  );
}