import { CONTRIBUTED_STATUS } from 'constant';
import React from 'react';

export const ContributionStatus = ({ status }) => {
  if (status === CONTRIBUTED_STATUS.ACCEPTED) {
    return (
      <span
        style={{
          color: 'green',
          fontWeight: 'bold',
          border: 'solid 1px green',
          padding: 4,
          borderRadius: 4,
          fontSize: 13,
        }}>
        Đã duyệt
      </span>
    );
  }
  if (status === CONTRIBUTED_STATUS.PENDING) {
    return (
      <span
        style={{
          color: 'orange',
          fontWeight: 'bold',
          border: 'solid 1px orange',
          padding: 4,
          borderRadius: 4,
          fontSize: 13,
        }}>
        Chờ duyệt
      </span>
    );
  }

  return (
    <span
      style={{
        color: 'red',
        fontWeight: 'bold',
        border: 'solid 1px red',
        padding: 4,
        borderRadius: 4,
        fontSize: 13,
      }}>
      Đã từ chối
    </span>
  );
};
