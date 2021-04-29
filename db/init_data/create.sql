DROP TABLE IF EXISTS movieReviews;
CREATE TABLE IF NOT EXISTS movieReviews(
  id SERIAL PRIMARY KEY,       
  movie_title VARCHAR(100),
  review VARCHAR(100),
  review_date VARCHAR(100)
);

INSERT INTO movieReviews (movie_title, review, review_date) VALUES ('Split', 'Good!', '2015-12-12'), ('Avengers', 'Loved this movie!', '2015-12-12');

/*Create a table within the database that has id, movie_title, review, review_date columns
psql -d postgres -U me
password is password*/