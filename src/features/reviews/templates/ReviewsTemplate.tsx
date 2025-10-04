import { memo, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import {
  Paper,
  Typography,
  Tabs,
  Tab,
  Container,
  Button,
  Box,
} from '@mui/material';
import { appTheme } from '../../../theme';
import { mockMovies as initialMockMovies } from './mockData';
import AddReviewDialog from '../components/AddReviewDialog';
import ReviewFeed from '../components/ReviewFeed';
import { GqlMovie, GqlReview } from '../../types/movie';

const randomUserPool = ['Ayla', 'Chrono', 'Nova', 'Riven', 'Kael', 'Mira', 'Orion', 'Vex'];
const randomUserName = () => randomUserPool[Math.floor(Math.random() * randomUserPool.length)];
const newId = () => crypto.randomUUID()

const ReviewsTemplate = () => {
  const [movies, setMovies] = useState<GqlMovie[]>(() => JSON.parse(JSON.stringify(initialMockMovies)));
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeMovie = useMemo(() => movies[activeIndex], [movies, activeIndex]);

  const handleChangeActive = (_: any, newIndex: number) => setActiveIndex(newIndex);
  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const handleSubmitNewReview = (values: { title: string; body: string; rating: number }) => {
    const review: GqlReview = {
      id: newId(),
      movieId: activeMovie.id,
      title: values.title,
      body: values.body ?? '',
      rating: values.rating,
      userByUserReviewerId: { id: newId(), name: randomUserName() },
    };
    setMovies(prev =>
      prev.map((movie, idx) =>
        idx === activeIndex
          ? { ...movie, movieReviewsByMovieId: { nodes: [review, ...movie.movieReviewsByMovieId.nodes] } }
          : movie
      )
    );
    closeDialog();
  };

  return (
    <div css={pageStyles.appRoot}>
      <Paper elevation={3} css={pageStyles.topBar}>
        <Typography css={pageStyles.brandText}>Cool Movies</Typography>
      </Paper>

      <Container maxWidth="lg" css={pageStyles.contentContainer}>
        <Typography variant="h1" css={pageStyles.pageTitle}>Movie Reviews</Typography>
        <Typography variant="subtitle1" css={pageStyles.pageSubtitle}>
          Explore what people are saying and add your own review.
        </Typography>

        <Box css={pageStyles.tabsContainer}>
          <Tabs
            value={activeIndex}
            onChange={handleChangeActive}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="select movie"
            css={pageStyles.tabsBar}
          >
            {movies.map((movie) => (
              <Tab
                key={movie.id}
                label={movie.title}
                css={pageStyles.tabItem}
                aria-controls={`movie-feed-${movie.id}`}
                id={`movie-tab-${movie.id}`}
              />
            ))}
          </Tabs>
        </Box>

        <ReviewFeed
          key={activeMovie.id}
          movie={activeMovie}
          containerId={`movie-feed-${activeMovie.id}`}
        />
      </Container>

      <Button
        variant="contained"
        color="secondary"
        onClick={openDialog}
        aria-label={`add review for ${activeMovie.title}`}
        css={pageStyles.fabAddReview}
      >
        Add Review
      </Button>

      <AddReviewDialog
        open={isDialogOpen}
        movieTitle={activeMovie.title}
        onClose={closeDialog}
        onSubmit={handleSubmitNewReview}
      />
    </div>
  );
};

const pageStyles = {
  appRoot: css({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: appTheme.palette.background.default,
  }),
  topBar: css({
    height: 56,
    borderRadius: 0,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    backgroundColor: appTheme.palette.background.paper,
  }),
  brandText: css({
    color: appTheme.palette.text.primary,
    fontWeight: 700,
    letterSpacing: '.2px',
  }),
  contentContainer: css({
    display: 'grid',
    gap: 16,
    paddingTop: 20,
    paddingBottom: 80,
  }),
  pageTitle: css({
    textAlign: 'center',
    letterSpacing: '-0.4px',
  }),
  pageSubtitle: css({
    textAlign: 'center',
    color: appTheme.palette.text.secondary,
    margin: '0 auto',
    maxWidth: 640,
  }),
  tabsContainer: css({
    display: 'flex',
    justifyContent: 'center',
    marginTop: 8,
  }),
  tabsBar: css({
    borderRadius: 12,
    backgroundColor: appTheme.palette.background.paper,
    boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
    padding: 6,
  }),
  tabItem: css({
    minHeight: 36,
    padding: '6px 14px',
    borderRadius: 10,
    '&.Mui-selected': {
      color: appTheme.palette.primary.main,
    },
  }),
  fabAddReview: css({
    position: 'fixed',
    right: 24,
    bottom: 24,
    borderRadius: 999,
    padding: '10px 18px',
    boxShadow: '0 10px 28px rgba(0,0,0,0.5)',
  }),
};

export default memo(ReviewsTemplate);
