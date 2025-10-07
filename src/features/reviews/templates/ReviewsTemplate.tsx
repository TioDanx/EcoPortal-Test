import { memo, useEffect, useState } from "react";
import { css } from "@emotion/react";
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Container,
  Button,
  Box,
} from "@mui/material";
import { appTheme } from "../../../theme";
import AddReviewDialog from "../components/AddReviewDialog";
import ReviewFeed from "../components/ReviewFeed";
import { useAppDispatch, useAppSelector } from "../../../state";
import { reviewsActions } from "../state/slice";

const ReviewsTemplate = () => {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.reviews.isLoadingMovies);
  const isSubmitting = useAppSelector(
    (state) => state.reviews.isSubmittingReview
  );
  const loadError = useAppSelector((state) => state.reviews.loadError);
  const movies = useAppSelector((state) => state.reviews.movies);
  const activeIndex = useAppSelector((state) => state.reviews.activeIndex);
  const activeMovie = movies[activeIndex];

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(reviewsActions.fetchMoviesRequested());
    dispatch(reviewsActions.fetchUsersRequested());
  }, [dispatch]);

  const handleChangeActive = (_: any, idx: number) =>
    dispatch(reviewsActions.setActiveIndex(idx));
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleSubmitNewReview = (values: {
    title: string;
    body: string;
    rating: number;
  }) => {
    if (!activeMovie) return;
    dispatch(
      reviewsActions.addReviewRequested({
        movieId: activeMovie.id,
        title: values.title,
        body: values.body ?? "",
        rating: values.rating,
      })
    );
    closeDialog();
  };

  return (
    <div css={pageStyles.appRoot}>
      {isLoading && (
        <Box css={pageStyles.skeletonBox} aria-live="polite">
          <Typography variant="body2" color="text.secondary" align="center">
            Loading movies…
          </Typography>
        </Box>
      )}
      {!isLoading && loadError && (
        <Box css={pageStyles.errorBox} role="alert">
          <Typography variant="body2" color="error" align="center">
            {loadError}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => dispatch(reviewsActions.fetchMoviesRequested())}
            sx={{ mt: 1 }}
          >
            Retry
          </Button>
        </Box>
      )}
      <Paper elevation={3} css={pageStyles.topBar} role="navigation">
        <Typography css={pageStyles.brandText}>Cool Movies</Typography>
      </Paper>

      <Container maxWidth="lg" css={pageStyles.contentContainer}>
        <Typography variant="h1" css={pageStyles.pageTitle}>
          Movie Reviews
        </Typography>
        <Typography variant="subtitle1" css={pageStyles.pageSubtitle}>
          Explore what people are saying and add your own review.
        </Typography>

        <Box css={pageStyles.tabsContainer}>
          <Tabs
            value={activeIndex}
            onChange={handleChangeActive}
            variant="scrollable"
            scrollButtons="auto"
            css={pageStyles.tabsBar}
          >
            {movies?.map((movie) => (
              <Tab
                key={movie.id}
                label={movie.title}
                css={pageStyles.tabItem}
              />
            ))}
          </Tabs>
        </Box>

        {!isLoading && !loadError && activeMovie && (
          <ReviewFeed
            key={activeMovie.id}
            movie={activeMovie}
            containerId={`movie-feed-${activeMovie.id}`}
          />
        )}
      </Container>

      {activeMovie && (
        <>
          <Button
            variant="contained"
            color="secondary"
            onClick={openDialog}
            disabled={isSubmitting}
            css={pageStyles.fabAddReview}
          >
            {isSubmitting ? "Saving…" : "Add Review"}
          </Button>
          <AddReviewDialog
            open={isDialogOpen}
            movieTitle={activeMovie.title}
            onClose={closeDialog}
            onSubmit={handleSubmitNewReview}
          />
        </>
      )}
    </div>
  );
};

const pageStyles = {
  appRoot: css({
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    backgroundColor: appTheme.palette.background.default,
  }),
  skeletonBox: css({ padding: 24 }),
  errorBox: css({
    padding: 24,
    display: "grid",
    justifyItems: "center",
    gap: 8,
  }),
  topBar: css({
    height: 56,
    borderRadius: 0,
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    backgroundColor: appTheme.palette.background.paper,
  }),
  brandText: css({
    color: appTheme.palette.text.primary,
    fontWeight: 700,
    letterSpacing: ".2px",
  }),
  contentContainer: css({
    display: "grid",
    gap: 16,
    paddingTop: 40,
    paddingBottom: 80,
  }),
  pageTitle: css({ textAlign: "center", letterSpacing: "-0.4px" }),
  pageSubtitle: css({
    textAlign: "center",
    color: appTheme.palette.text.secondary,
    margin: "0 auto",
    maxWidth: 640,
  }),
  tabsContainer: css({
    display: "flex",
    justifyContent: "center",
    marginTop: 8,
  }),
  tabsBar: css({
    borderRadius: 12,
    backgroundColor: appTheme.palette.background.paper,
    boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
    padding: 6,
  }),
  tabItem: css({
    minHeight: 36,
    padding: "6px 14px",
    borderRadius: 10,
    "&.Mui-selected": { color: appTheme.palette.secondary.main },
  }),
  fabAddReview: css({
    position: "fixed",
    right: 24,
    bottom: 24,
    borderRadius: 999,
    padding: "10px 18px",
    boxShadow: "0 10px 28px rgba(0,0,0,0.5)",
  }),
};

export default memo(ReviewsTemplate);
