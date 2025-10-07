import type { AllMoviesQuery, AllUsersQuery } from "../../generated/graphql";

export type GqlMovie = NonNullable<
  NonNullable<AllMoviesQuery["allMovies"]>["nodes"][number]
>;

export type GqlReview = NonNullable<
  NonNullable<GqlMovie["movieReviewsByMovieId"]>["nodes"][number]
>;

export type GqlUser = NonNullable<
  NonNullable<AllUsersQuery["allUsers"]>["nodes"][number]
>;

export type GqlReviewConnection = NonNullable<
  GqlMovie["movieReviewsByMovieId"]
>;

export type AddReviewFormValues = {
  title: string;
  body: string;
  rating: number;
};

export type AddReviewDialogProps = {
  open: boolean;
  movieTitle?: string;
  onClose: () => void;
  onSubmit: (values: AddReviewFormValues) => void;
};

export type ReviewFeedProps = {
  movie: GqlMovie;
  containerId: string;
};

export type AddReviewPayload = {
  movieId: string;
  review: Omit<GqlReview, "id" | "movieId"> & { id: string };
};

export type ReviewsState = {
  movies: GqlMovie[];
  activeIndex: number;
  isLoadingMovies: boolean;
  loadError?: string;
  isSubmittingReview: boolean;
};

export type AddReviewRequestPayload = {
  movieId: string;
  title: string;
  body: string;
  rating: number;
  userNameFallback?: string;
};

export type AddReviewCommittedPayload = {
  movieId: string;
  review: GqlReview;
};
