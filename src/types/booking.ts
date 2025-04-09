// src/types/booking.ts
export interface HotelSearchParams {
  destId: string; // dest_id로 변경
  searchType?: string; // search_type 추가, 기본값 "city"로 설정 가능
  checkInDate: string; // arrival_date와 매핑
  checkOutDate: string; // departure_date와 매핑
  adults: number;
  children?: number;
  roomCount?: number;
  currency?: string;
}

export interface Hotel {
  id: number;
  checkin: { fromTime: string; untilTime: string };
  checkinDate: string;
  checkout: { fromTime: string; untilTime: string };
  checkoutDate: string;
  countryCode: string;
  currency: string;
  photoUrls: string[];
  wishlistName: string;
  name: string;
  reviewScore: number;
  reviewCount: number;
}

export interface HotelSearchResponse {
  results: Hotel[];
  totalCount: number;
}

export interface HotelDetailsResponse {
  hotel: Hotel & {
    description: string;
    photos: string[];
    amenities: string[];
    rooms: Room[];
  };
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: {
    currency: string;
    amount: number;
    formattedAmount: string;
  };
  capacity: number;
  includesBreakfast: boolean;
  cancellationPolicy: string;
}

export interface BookingRequest {
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  paymentInfo?: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardholderName: string;
  };
}
