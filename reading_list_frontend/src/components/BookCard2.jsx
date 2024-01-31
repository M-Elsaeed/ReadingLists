import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export default function BookCard({
  bookTitle,
  bookISBN,
  bookAuthor,
  bookCoverLink,
  bookStatus
}
) {
  return (
    <Card className='transparent-Card' sx={{ maxWidth: 200 }}>
      <CardMedia
        sx={{ height: 250 }}
        image={bookCoverLink}
        title={bookTitle}
      />
      <CardContent className='left-aligned-text'>
        <Typography gutterBottom variant="h5" component="div">
          {bookTitle}
        </Typography>
        <Typography variant="body2">
          Author: {bookAuthor}
        </Typography>
        <Typography variant="body2">
          ISBN: {bookISBN}
        </Typography>
        <Typography variant="body2">
          Status: {bookStatus}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Edit</Button>
        <Button size="small">Delete</Button>
      </CardActions>
    </Card>
  );
}