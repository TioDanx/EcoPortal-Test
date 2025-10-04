export interface GqlUser {
    id: string;
    name: string;
  }
  
  export interface GqlReview {
    id: string;
    movieId: string;
    title: string;
    body: string;
    rating: number;
    userByUserReviewerId: GqlUser;
  }
  
  export interface GqlReviewConnection {
    nodes: GqlReview[];
  }
  
  export interface GqlMovie {
    id: string;
    title: string;
    imgUrl: string;
    releaseDate: string; 
    movieReviewsByMovieId: GqlReviewConnection;
  }
  
  export interface GqlAllMovies {
    data: {
      allMovies: {
        nodes: GqlMovie[];
      };
    };
  }
  
  export type AddReviewFormValues = {
    title: string;
    body: string;
    rating: number;
  };
  
  export type AddReviewDialogProps = {
    open: boolean;
    movieTitle?: string;
    onClose: () => void;
    onSubmit: (values: AddReviewFormValues) => void;
  };

  export type ReviewFeedProps = {
    movie: GqlMovie;
    containerId: string;
  };
  