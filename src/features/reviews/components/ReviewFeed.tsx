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
import { ReviewFeedProps } from "../../types/movie";


const CLAMP_LINES = 3;
const LINE_HEIGHT_EM = 1.5;
const CLAMP_THRESHOLD = 180;

const ReviewFeed = ({ movie, containerId }: ReviewFeedProps) => {
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const reviews = movie.movieReviewsByMovieId.nodes;

  const averageRating = useMemo(
    () =>
      reviews.length
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0,
    [reviews]
  );

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;
  const isDesktop = useMediaQuery(appTheme.breakpoints.up("md"));

  const toggleItem = (id: string) =>
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <section
      id={containerId}
      css={feedStyles.feedWrapper}
      aria-labelledby="feed-heading"
    >
      <header css={feedStyles.headerSection}>
        <img
          src={movie.imgUrl}
          alt={`${movie.title} poster`}
          css={feedStyles.headerPoster}
        />

        <div css={feedStyles.headerInfoColumn}>
          <Typography
            id="feed-heading"
            variant="h5"
            css={feedStyles.headerTitle}
          >
            {movie.title}
          </Typography>

          <Typography variant="body2" css={feedStyles.releaseText}>
            {releaseYear ?? "-"}
          </Typography>

          <div css={feedStyles.metricRow}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body2" css={feedStyles.metricText}>
              {averageRating.toFixed(1)} · {reviews.length}{" "}
              {reviews.length === 1 ? "review" : "reviews"}
            </Typography>
          </div>
        </div>
      </header>

      <Divider css={feedStyles.headerDivider} />

      <div css={feedStyles.listContainer}>
        {reviews.map((review, idx) => {
          const shouldShowButton =
            !isDesktop && review.body.length > CLAMP_THRESHOLD;
          const shouldClampMobile = !isDesktop && !expandedIds[review.id];

          return (
            <div key={review.id} css={feedStyles.reviewCard}>
              <Stack
                direction="row"
                spacing={2}
                alignItems="flex-start"
                css={feedStyles.reviewRow}
              >
                <Avatar css={feedStyles.avatarBadge}>
                  {review.userByUserReviewerId.name.charAt(0)}
                </Avatar>

                <div css={feedStyles.reviewContent}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    css={feedStyles.reviewHeaderRow}
                  >
                    <Typography
                      variant="subtitle2"
                      css={feedStyles.reviewerName}
                    >
                      {review.userByUserReviewerId.name} - {review.title}
                    </Typography>
                    <Rating value={review.rating} readOnly size="small" />
                  </Stack>

                  <Typography
                    variant="body2"
                    css={[
                      feedStyles.reviewBodyText,
                      shouldClampMobile && feedStyles.clampedBodyMobile,
                    ]}
                  >
                    {review.body}
                  </Typography>

                  {shouldShowButton && (
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => toggleItem(review.id)}
                      css={feedStyles.readMoreButtonMobile}
                      aria-expanded={Boolean(expandedIds[review.id])}
                    >
                      {expandedIds[review.id] ? "Show less" : "Read more"}
                    </Button>
                  )}
                </div>
              </Stack>

              {idx < reviews.length - 1 && (
                <Divider css={feedStyles.itemDivider} />
              )}
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
    display: "grid",
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
  }),
  metricText: css({
    color: appTheme.palette.text.secondary,
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
    backgroundColor: appTheme.palette.primary.main,
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
    [up("md")]: {
      display: "none",
    },
  }),
  itemDivider: css({
    opacity: 0.14,
    marginTop: 8,
  }),
};

export default memo(ReviewFeed);
