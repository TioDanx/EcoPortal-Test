import { css } from '@emotion/react';
import { memo } from 'react';
import { Paper, Typography, Container } from '@mui/material';


function ReviewsTemplate() {
  return (
    <div css={styles.root}>
      <Paper elevation={0} css={styles.navbar}>
        <Typography fontWeight={700}>Cool Movies</Typography>
      </Paper>

      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h4" css={styles.sectionTitle}>
          Destacadas
        </Typography>
      </Container>
    </div>
  );
}

const styles = {
  root: css({
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  }),
  navbar: css({
    height: 48,
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    borderRadius: 0,
  }),
  sectionTitle: css({
    fontWeight: 600,
    marginTop: 8,
  }),
};

export default memo(ReviewsTemplate);
