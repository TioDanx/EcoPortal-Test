import { RootState } from '../../../state/store';

export const selectReviewsState = (state: RootState) => state.reviews;

export const selectMovies = (state: RootState) =>
  selectReviewsState(state).movies;

export const selectActiveIndex = (state: RootState) =>
  selectReviewsState(state).activeIndex;

export const selectActiveMovie = (state: RootState) => {
  const { movies, activeIndex } = selectReviewsState(state);
  return movies[activeIndex];
};
