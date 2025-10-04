import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReviewsState, AddReviewPayload } from "../../types/movie";
import { mockMovies as initialMovies } from "../templates/mockData";

const initialState: ReviewsState = {
  movies: initialMovies,
  activeIndex: 0,
};

export const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
    addReviewCommitted: (state, action: PayloadAction<AddReviewPayload>) => {
      const { movieId, review } = action.payload;
      const movie = state.movies.find((m) => m.id === movieId);
      if (!movie) return;
      movie.movieReviewsByMovieId.nodes.unshift({ ...review, movieId });
    },

    addReviewRequested: (
      state,
      _action: PayloadAction<{
        movieId: string;
        title: string;
        body: string;
        rating: number;
      }>
    ) => {},
  },
});

export const { actions: reviewsActions, reducer: reviewsReducer } =
  reviewsSlice;
export type ReviewsActions = typeof reviewsActions;
