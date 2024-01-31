import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SearchBox from './components/SearchBox'
import { ReadingList } from './components/ReadingList'


function App() {
	const [count, setCount] = useState(0)

	return (
		<>
		<div style={{display: "flex !important"}}>
			{/* <SearchBox></SearchBox> */}
			<ReadingList></ReadingList>
		</div>

		</>
	)
}

export default App
