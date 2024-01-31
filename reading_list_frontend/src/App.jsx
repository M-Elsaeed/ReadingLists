import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import BookCard from './components/BookCard'
import Grid from '@mui/material/Unstable_Grid2';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <Grid container spacing={2}>
        <Grid xs={4}>
          <BookCard bookTitle="Book1" bookCoverLink="https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg"></BookCard>

        </Grid>
        <Grid xs={4}>
          <BookCard bookTitle="Book1" bookCoverLink="https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg"></BookCard>

        </Grid>
        <Grid xs={4}>
          <BookCard bookTitle="Book1" bookCoverLink="https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg"></BookCard>

        </Grid>
        <Grid xs={4}>
          <BookCard bookTitle="Book1" bookCoverLink="https://covers.openlibrary.org/b/isbn/9780385533225-L.jpg"></BookCard>

        </Grid>
      </Grid>
    </div>
  )
}

export default App
