import { memo, useMemo, useState } from "react";
import { css } from "@emotion/react";
import {
  Stack,
  Typography,
  Divider,
  Rating,
  Avatar,
  Button,
  useMediaQuery,
} from "@mui/material";
import { appTheme } from "../../../theme";
import { ReviewFeedProps, GqlReview } from "../../types/movie";

const CLAMP_LINES = 3;
const LINE_HEIGHT_EM = 1.5;
const CLAMP_THRESHOLD = 180;

type SortOrder = "asc" | "desc";

const ReviewFeed = ({ movie, containerId }: ReviewFeedProps) => {
  const [expandedById, setExpandedById] = useState<Record<string, boolean>>({});
  const [currentSortOrder, setCurrentSortOrder] = useState<SortOrder>("desc");
  const isDesktop = useMediaQuery(appTheme.breakpoints.up("md"));

  const reviews: GqlReview[] = (movie.movieReviewsByMovieId?.nodes ?? []).filter(
    (review): review is GqlReview => Boolean(review)
  );

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0);
    return total / reviews.length;
  }, [reviews]);

  const sortedReviews = useMemo(() => {
    const copy = [...reviews];
    copy.sort((a, b) => {
      const ratingA = a.rating ?? 0;
      const ratingB = b.rating ?? 0;
      return currentSortOrder === "asc" ? ratingA - ratingB : ratingB - ratingA;
    });
    return copy;
  }, [reviews, currentSortOrder]);

  const releaseYear = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;

  const toggleExpandedItem = (id: string) =>
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleSortOrder = () =>
    setCurrentSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const sortIndicator = currentSortOrder === "asc" ? "↑" : "↓";

  return (
    <section id={containerId} css={feedStyles.feedWrapper} aria-labelledby="feed-heading">
      <header css={feedStyles.headerSection}>
        <img
          src={movie.imgUrl ?? ""}
          alt={`${movie.title ?? "Movie"} poster`}
          css={feedStyles.headerPoster}
        />

        <div css={feedStyles.headerInfoColumn}>
          <div>
            <Typography id="feed-heading" variant="h5" css={feedStyles.headerTitle}>
              {movie.title ?? "Untitled"}
            </Typography>

            <Typography variant="body2" css={feedStyles.releaseText}>
              {releaseYear ?? "—"}
            </Typography>
          </div>

          <div css={feedStyles.metricRow}>
            <div css={feedStyles.metricGroup}>
              <Rating value={averageRating} precision={0.5} readOnly />
              <Typography variant="body2" css={feedStyles.metricText}>
                {averageRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </Typography>
            </div>

            <Button
              variant="outlined"
              size="small"
              onClick={toggleSortOrder}
              css={feedStyles.orderByButton}
              aria-pressed={currentSortOrder === "desc"}
              aria-label={`order reviews by rating ${currentSortOrder === "asc" ? "ascending" : "descending"}`}
              title={`Order by rating ${currentSortOrder === "asc" ? "ascending" : "descending"}`}
            >
              {`Rating ${sortIndicator}`}
            </Button>
          </div>
        </div>
      </header>

      <Divider css={feedStyles.headerDivider} />

      <div css={feedStyles.listContainer}>
        {sortedReviews.map((review, index) => {
          const reviewerName = review.userByUserReviewerId?.name ?? "Unknown";
          const reviewBody = review.body ?? "";
          const shouldShowToggle = !isDesktop && reviewBody.length > CLAMP_THRESHOLD;
          const shouldClampMobile = !isDesktop && !expandedById[review.id as string];

          return (
            <div key={String(review.id)} css={feedStyles.reviewCard}>
              <Stack direction="row" spacing={2} alignItems="flex-start" css={feedStyles.reviewRow}>
                <Avatar css={feedStyles.avatarBadge}>{reviewerName.charAt(0)}</Avatar>

                <div css={feedStyles.reviewContent}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    css={feedStyles.reviewHeaderRow}
                  >
                    <Typography variant="subtitle2" css={feedStyles.reviewerName}>
                      {reviewerName} — {review.title ?? "Review"}
                    </Typography>
                    <Rating value={review.rating ?? 0} readOnly size="small" />
                  </Stack>

                  <Typography
                    variant="body2"
                    css={[feedStyles.reviewBodyText, shouldClampMobile && feedStyles.clampedBodyMobile]}
                  >
                    {reviewBody}
                  </Typography>

                  {shouldShowToggle && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleExpandedItem(String(review.id))}
                      css={feedStyles.readMoreButtonMobile}
                      aria-expanded={Boolean(expandedById[String(review.id)])}
                    >
                      {expandedById[String(review.id)] ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
              </Stack>

              {index < sortedReviews.length - 1 && <Divider css={feedStyles.itemDivider} />}
            </div>
          );
        })}
      </div>
    </section>
  );
};

const up = appTheme.breakpoints.up;

const feedStyles = {
  feedWrapper: css({
    display: "grid",
    gap: 16,
    backgroundColor: appTheme.palette.background.paper,
    borderRadius: 14,
    padding: 16,
    boxShadow: "0 6px 24px rgba(0,0,0,0.35)",
  }),
  headerSection: css({
    display: "grid",
    gridTemplateColumns: "1fr",
    justifyContent: "space-evenly",
    gap: 12,
    [up("md")]: {
      gridTemplateColumns: "200px 1fr",
      alignItems: "center",
      gap: 20,
    },
  }),
  headerPoster: css({
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 12,
    [up("sm")]: { height: 220 },
    [up("md")]: { height: 260 },
  }),
  headerInfoColumn: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    height: "100%",
    gap: 6,
    [up("md")]: { gap: 8 },
  }),
  headerTitle: css({
    letterSpacing: "-0.2px",
    fontWeight: 700,
    color: appTheme.palette.text.primary,
  }),
  releaseText: css({
    color: appTheme.palette.text.secondary,
  }),
  metricRow: css({
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginTop: 2,
    width: "100%",
  }),
  metricGroup: css({
    display: "flex",
    alignItems: "center",
    gap: 10,
    minWidth: 0,
  }),
  metricText: css({
    color: appTheme.palette.text.secondary,
    whiteSpace: "nowrap",
  }),
  orderByButton: css({
    marginLeft: "auto",
    borderRadius: 10,
    paddingInline: 12,
    height: 30,
  }),
  headerDivider: css({
    opacity: 0.12,
  }),
  listContainer: css({
    display: "grid",
    gap: 8,
  }),
  reviewCard: css({
    display: "grid",
    gap: 8,
  }),
  reviewRow: css({
    display: "flex",
    flexDirection: "row",
    width: "100%",
  }),
  avatarBadge: css({
    width: 32,
    height: 32,
    fontSize: "0.9rem",
    backgroundColor: appTheme.palette.secondary.main,
  }),
  reviewContent: css({
    display: "grid",
    gap: 8,
    width: "100%",
  }),
  reviewHeaderRow: css({
    alignItems: "center",
  }),
  reviewerName: css({
    color: appTheme.palette.text.primary,
    fontWeight: 500,
  }),
  reviewBodyText: css({
    color: appTheme.palette.text.secondary,
  }),
  clampedBodyMobile: css({
    display: "-webkit-box",
    WebkitBoxOrient: "vertical" as unknown as "vertical",
    WebkitLineClamp: CLAMP_LINES as unknown as number,
    lineHeight: `${LINE_HEIGHT_EM}em`,
    maxHeight: `calc(${LINE_HEIGHT_EM}em * ${CLAMP_LINES})`,
    overflow: "hidden",
    wordBreak: "break-word",
  }),
  readMoreButtonMobile: css({
    alignSelf: "flex-start",
    paddingLeft: 0,
    color: appTheme.palette.text.secondary,
    "&:hover": { color: appTheme.palette.text.primary },
    [up("md")]: { display: "none" },
  }),
  itemDivider: css({
    opacity: 0.14,
    marginTop: 8,
  }),
};

export default memo(ReviewFeed);
