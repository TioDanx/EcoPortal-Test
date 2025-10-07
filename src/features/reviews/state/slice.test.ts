import { reviewsReducer, reviewsActions } from "./slice";
import type { GqlMovie, GqlReview } from "../../types/movie";

const createMockMovie = (id = "m1"): GqlMovie => ({
  id,
  title: "Movie",
  imgUrl: "",
  releaseDate: "2020-01-01",
  movieReviewsByMovieId: { nodes: [] as GqlReview[] },
});

const createMockReview = (id = "r1", movieId = "m1"): GqlReview => ({
  id,
  movieId,
  title: "T",
  body: "B",
  rating: 5,
  userByUserReviewerId: { id: "u1", name: "Ayla" },
});

test("fetchMoviesLoaded stores movies", () => {
  const previousState = {
    movies: [],
    activeIndex: 0,
    isLoadingMovies: true,
    isSubmittingReview: false,
  } as any;
  const nextState = reviewsReducer(
    previousState,
    reviewsActions.fetchMoviesLoaded({ movies: [createMockMovie()] })
  );
  expect(nextState.isLoadingMovies).toBe(false);
  expect(nextState.movies).toHaveLength(1);
});

test("addReviewCommitted inserts at the beginning", () => {
  const previousState = {
    movies: [createMockMovie("m1")],
    activeIndex: 0,
    isLoadingMovies: false,
    isSubmittingReview: false,
  } as any;
  const nextState = reviewsReducer(
    previousState,
    reviewsActions.addReviewCommitted({
      movieId: "m1",
      review: createMockReview("rX", "m1"),
    })
  );

  expect(nextState.movies[0].movieReviewsByMovieId!.nodes![0]!.id).toBe("rX");
});
