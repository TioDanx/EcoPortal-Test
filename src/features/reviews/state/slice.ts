// src/features/reviews/state/slice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GqlMovie, GqlReview, GqlUser } from "../../types/movie";
import type { AddReviewRequestPayload } from "../../types/movie";

type ReviewsState = {
  movies: GqlMovie[];
  users: GqlUser[];
  activeIndex: number;
  isLoadingMovies: boolean;
  loadError?: string;
  isSubmittingReview: boolean;
};

const initialState: ReviewsState = {
  movies: [],
  users: [],
  activeIndex: 0,
  isLoadingMovies: false,
  isSubmittingReview: false,
};

type LoadMoviesSuccessPayload = { movies: GqlMovie[] };
type LoadUsersSuccessPayload = { users: GqlUser[] };

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },

    fetchMoviesRequested: (state) => {
      state.isLoadingMovies = true;
      state.loadError = undefined;
    },
    fetchMoviesLoaded: (state, action: PayloadAction<LoadMoviesSuccessPayload>) => {
      state.isLoadingMovies = false;
      state.movies = action.payload.movies;
      if (state.activeIndex >= state.movies.length) state.activeIndex = 0;
    },
    fetchMoviesFailed: (state, action: PayloadAction<{ message: string }>) => {
      state.isLoadingMovies = false;
      state.loadError = action.payload.message;
    },

    fetchUsersRequested: (_state) => {},
    fetchUsersLoaded: (state, action: PayloadAction<LoadUsersSuccessPayload>) => {
      state.users = action.payload.users;
    },
    fetchUsersFailed: (_state) => {},

    addReviewRequested: (state, _action: PayloadAction<AddReviewRequestPayload>) => {
      state.isSubmittingReview = true;
    },
    addReviewCommitted: (
      state,
      action: PayloadAction<{ movieId: string; review: GqlReview }>
    ) => {
      state.isSubmittingReview = false;
      const target = state.movies.find((m) => m.id === action.payload.movieId);
      if (!target) return;
      target.movieReviewsByMovieId.nodes.unshift(action.payload.review);
    },
    addReviewFailed: (state) => {
      state.isSubmittingReview = false;
    },
  },
});

export const { actions: reviewsActions, reducer: reviewsReducer } = reviewsSlice;
export type ReviewsActions = typeof reviewsActions;
