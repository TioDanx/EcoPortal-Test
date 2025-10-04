import { memo, useMemo, useState } from 'react';
import { css } from '@emotion/react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Box,
  IconButton,
  Typography,
  Divider,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { appTheme } from '../../../theme';

type AddReviewFormValues = {
  title: string;
  body: string;
  rating: number;
};

type AddReviewDialogProps = {
  open: boolean;
  movieTitle?: string;
  onClose: () => void;
  onSubmit: (values: AddReviewFormValues) => void;
};

const TITLE_MAX = 80;
const BODY_MAX = 800;

const AddReviewDialog = ({ open, movieTitle, onClose, onSubmit }: AddReviewDialogProps) => {
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewBody, setReviewBody] = useState('');
  const [reviewRating, setReviewRating] = useState<number | null>(4);

  const titleError = useMemo(() => !reviewTitle.trim() ? 'Title is required' : undefined, [reviewTitle]);
  const ratingError = useMemo(() => reviewRating == null ? 'Rating is required' : undefined, [reviewRating]);

  const isSubmitDisabled = Boolean(titleError || ratingError);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (isSubmitDisabled || reviewRating == null) return;
    onSubmit({ title: reviewTitle.trim(), body: reviewBody.trim(), rating: reviewRating });
    setReviewTitle('');
    setReviewBody('');
    setReviewRating(4);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="add-review-title"
      css={styles.dialogRoot}
    >
      <div css={styles.dialogHeaderBar}>
        <DialogTitle id="add-review-title" css={styles.dialogTitleText}>
          Add Review
          {movieTitle && <Typography variant="subtitle2" css={styles.dialogSubtitleText}>for “{movieTitle}”</Typography>}
        </DialogTitle>
        <IconButton aria-label="close dialog" onClick={onClose} css={styles.closeButton}>
          <CloseRoundedIcon />
        </IconButton>
      </div>

      <Divider css={styles.headerDivider} />

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent css={styles.dialogContentGrid}>
          <Box css={styles.fieldGroup}>
            <TextField
              label="Title"
              placeholder="A concise headline for your review"
              value={reviewTitle}
              onChange={(e) => setReviewTitle(e.target.value.slice(0, TITLE_MAX))}
              fullWidth
              error={Boolean(titleError)}
              helperText={titleError || `${reviewTitle.length}/${TITLE_MAX}`}
              inputProps={{ maxLength: TITLE_MAX }}
            />
          </Box>

          <Box css={styles.fieldGroup}>
            <TextField
              label="Body"
              placeholder="What did you like or dislike? Keep it helpful."
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value.slice(0, BODY_MAX))}
              fullWidth
              multiline
              minRows={4}
              helperText={`${reviewBody.length}/${BODY_MAX}`}
              inputProps={{ maxLength: BODY_MAX }}
            />
          </Box>

          <Box css={styles.ratingRow} aria-label="rating input">
            <Typography variant="body2" css={styles.ratingLabel}>Your rating</Typography>
            <Rating value={reviewRating} precision={0.5} onChange={(_, v) => setReviewRating(v)} />
            {ratingError && <Typography variant="caption" color="error" css={styles.ratingErrorText}>{ratingError}</Typography>}
          </Box>
        </DialogContent>

        <DialogActions css={styles.actionsRow}>
          <Button variant="text" onClick={onClose}>Cancel</Button>
          <Button variant="contained" color="secondary" type="submit" disabled={isSubmitDisabled}>
            Save Review
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

const styles = {
  dialogRoot: css({
    '& .MuiDialog-paper': {
      backgroundColor: appTheme.palette.background.paper,
      borderRadius: 16,
      boxShadow: '0 18px 60px rgba(0,0,0,0.6)',
      overflow: 'hidden',
    },
  }),
  dialogHeaderBar: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingInline: 16,
    paddingTop: 12,
  }),
  dialogTitleText: css({
    display: 'grid',
    gap: 2,
    color: appTheme.palette.text.primary,
    paddingRight: 8,
  }),
  dialogSubtitleText: css({
    color: appTheme.palette.text.secondary,
  }),
  closeButton: css({
    color: appTheme.palette.text.secondary,
    '&:hover': { color: appTheme.palette.text.primary },
  }),
  headerDivider: css({
    opacity: 0.12,
  }),
  dialogContentGrid: css({
    display: 'grid',
    gap: 16,
    paddingTop: 16,
  }),
  fieldGroup: css({
    display: 'grid',
    gap: 8,
  }),
  ratingRow: css({
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    paddingTop: 4,
  }),
  ratingLabel: css({
    color: appTheme.palette.text.secondary,
    minWidth: 88,
  }),
  ratingErrorText: css({
    marginLeft: 'auto',
  }),
  actionsRow: css({
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '8px 16px 16px',
    gap: 8,
  }),
};

export default memo(AddReviewDialog);
