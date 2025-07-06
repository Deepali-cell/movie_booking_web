export interface UserType {
  _id: string;
  name: string;
  email: string;
  image: string;
  phoneNumber: string;
  role: "user" | "owner" | "admin";
  createdAt: string;
}
export interface ShowFormData {
  theaterId: string;
  blockId: string;
  movie: string;
  showDate: string;
  showTime: string;
  showPrice: number;
  status: "scheduled" | "cancelled" | "completed";
}

export type MovieFormType = Omit<MovieType, "_id" | "createdAt" | "updatedAt">;

export interface FoodItemType {
  _id: string;
  name: string;
  image: string;
  type: "snack" | "beverage" | "meal";
  price: number;
  isVegetarian: boolean;
  isVegan: boolean;
}

export interface FoodCourtType {
  _id: string;
  theater: string; // or TheaterType if you populate
  name: string;
  location: {
    block?: string;
    floor?: string;
  };
  foodMenu: FoodItemType[];
  foodService: {
    deliveryType: "in-seat" | "self-service";
    allowsAllergyNote: boolean;
    orderReviews: {
      userId: string;
      userName: string;
      comment: string;
      rating: number;
      createdAt: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface FacilityType {
  type: string[];
  forCategory: string[];
  location: {
    block?: string;
    screen?: string;
    floor?: string;
    near?: string;
  };
  description?: string;
  isAvailable?: boolean;
}

export interface ReviewType {
  userId: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt: string;
}

export interface BlockType {
  _id: string;
  name: string;
  screen: string;
  movies: ShowType[];
}

export interface TheaterType {
  _id: string;
  name: string;
  description?: string;
  image: string;
  location: {
    addressLine?: string;
    city?: string;
    state?: string;
    country?: string;
    pincode?: string;
    landmarks?: string[];
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  basicServices: string[];
  screens: {
    name: string;
    capacity: number;
    type: "Normal" | "3D" | "IMAX";
  }[];
  moviesPlaying: string[]; // can also be ShowType if populated
  allMovies: string[]; // or MovieType[]
  supportedGenres: string[];
  supportedLanguages: string[];
  facilities: FacilityType[];
  foodCourts: FoodCourtType[];
  operatingHours: {
    open?: string;
    close?: string;
  };
  offDays: string[];
  ratings: {
    cleaningRating?: number;
    totalRatings?: number;
  };
  reviews: ReviewType[];
  isActive: boolean;
  isVerified: boolean;
  tier: "normal" | "premium" | "luxury" | "budget";
  cancellationPolicy: {
    refundable?: boolean;
    refundWindowInHours?: number;
  };
  blocks: BlockType[];
  createdAt: string;
  updatedAt: string;
}

export interface MovieType {
  _id: string;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  tagline: string;
  genres: { id: number; name: string }[];
  casts: { name: string; profile_path: string }[];
  original_language: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
  shorts: string[];
  movieReview?: {
    userId: string;
    userName: string;
    comment: string;
    rating: number;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ShowType {
  _id: string;
  blockId: {
    _id: string;
    name: string;
    screen: string;
  };
  movie: MovieType;
  showDate: string;
  showTime: string;
  showPrice: number;
  occupiedSeats: Record<string, boolean>;
  status: "scheduled" | "cancelled" | "completed";
  showReview: {
    userId: string;
    userName: string;
    comment: string;
    rating: number;
    createdAt: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface FoodOrderType {
  _id: string;
  userDetail: {
    name: string;
    seat: string;
    block: string;
    action: string;
  };
  theaterId: TheaterType | string;
  foodCourtId: FoodCourtType | string;
  items: {
    name: string;
    quantity: number;
    price: number;
    allergyNote?: string;
  }[];
  totalAmount: number;
  paymentType: "cash" | "online";
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  createdAt: string;
  updatedAt: string;
}

export interface BookingType {
  _id: string;
  user: UserType | string;
  theater: TheaterType | string;
  movie: ShowType;
  seats: string[];
  totalPrice: number;
  foodOrder?: FoodOrderType;
  paymentStatus: "pending" | "paid" | "cancelled";
  createdAt: string;
  updatedAt: string;
  groupPlan?: GroupPlanType;
}

export interface OwnerType {
  _id: string;
  isVerified: boolean;
  isActive: boolean;
  userId: Omit<UserType, "_id" | "createdAt" | "role"> & { role: "owner" };
  theaters: TheaterType[];
}

export interface GroupPlanType {
  _id: string;
  creator: UserType | string;
  inviteLink: string;
  theater: TheaterType | string;
  invitedUsers: (UserType | string)[];
  userSelections: {
    user: UserType | string;
    theaters: (TheaterType | string)[];
    shows: (ShowType | string)[];
    completed: boolean;
    voted: boolean;
  }[];
  votes: {
    user: UserType | string;
    movie: ShowType | string;
  }[];
  finalMovie?: ShowType | string;
  votingStarted: boolean;
  votingEndsAt?: string;
  dateOfShow?: string;
  groupBooking?: BookingType | string;
  paymentStatus: "pending" | "split" | "singlePaid" | "completed";
  splitDetails: {
    user: UserType | string;
    amount: number;
    paid: boolean;
  }[];
  createdAt: string;
  updatedAt: string;
}
