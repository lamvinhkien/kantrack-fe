import AppBar from '~/components/AppBar/AppBar'
import HomeContent from './HomeContent/HomeContent'
import Container from '@mui/material/Container'

const Home = () => {
  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <HomeContent />
    </Container>
  )
}

export default Home
