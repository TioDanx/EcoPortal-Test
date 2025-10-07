import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "../../../../test/utils/renderWithProviders";
import ReviewFeed from "./ReviewFeed";
import type { GqlMovie, GqlReview } from "../../types/movie";

const createMockReview = (id: string, rating: number): GqlReview => ({
  id,
  movieId: "movie-1",
  title: `Title ${id}`,
  body: "Sample review body",
  rating,
  userByUserReviewerId: { id: `user-${id}`, name: `User ${id}` },
});

const mockMovie: GqlMovie = {
  id: "movie-1",
  title: "Movie X",
  imgUrl: "",
  releaseDate: "2019-05-20",
  movieReviewsByMovieId: {
    nodes: [createMockReview("1", 3), createMockReview("2", 5)],
  },
};

test("renders movie title and order-by button", () => {
  renderWithProviders(
    <ReviewFeed movie={mockMovie} containerId="container-1" />
  );
  expect(screen.getByText("Movie X")).toBeInTheDocument();
  const orderByButton = screen.getByRole("button", {
    name: /order reviews by rating/i,
  });
  expect(orderByButton).toBeInTheDocument();
  fireEvent.click(orderByButton);
});
