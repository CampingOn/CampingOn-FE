import { useEffect } from 'react';
import { useApi } from 'hooks/useApi';
import { reservationService } from 'api/services/reservationService';

const ReservationList = () => {
  const { execute: getReservations, loading, error, data } = useApi(reservationService.getReservations);

  useEffect(() => {
    getReservations(1);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred</div>;
  if (!data) return <div>No data</div>;

  return (
      <div>
        {data.content?.map(reservation => (
            <div key={reservation.id}>
              <h3>예약 ID: {reservation.id}</h3>
              <p>체크인: {reservation.checkIn}</p>
              <p>체크아웃: {reservation.checkOut}</p>
              <p>인원: {reservation.guestCnt}</p>
              <p>상태: {reservation.status}</p>
              <p>총 가격: {reservation.totalPrice}</p>
            </div>
        ))}
      </div>
  );
};

export default ReservationList;
