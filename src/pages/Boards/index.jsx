/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import AppBar from '~/components/AppBar/AppBar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Skeleton from '@mui/material/Skeleton'
import randomColor from 'randomcolor'
import SidebarCreateBoardModal from './create'
import { fetchBoardsAPI, getRecentBoards } from '~/apis'
import { DEFAULT_PAGE, DEFAULT_ITEMS_PER_PAGE } from '~/utils/constants'
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard'
import GroupIcon from '@mui/icons-material/Group'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useTranslation } from 'react-i18next'
import { getScrollbarStyles } from '~/utils/formatters'

const Boards = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const ownerPage = parseInt(query.get('ownerPage') || DEFAULT_PAGE, 10)
  const memberPage = parseInt(query.get('memberPage') || DEFAULT_PAGE, 10)
  const colorCache = useRef({})

  const [ownerBoards, setOwnerBoards] = useState([])
  const [memberBoards, setMemberBoards] = useState([])
  const [recentBoards, setRecentBoards] = useState([])
  const [totalOwnerBoards, setTotalOwnerBoards] = useState(0)
  const [totalMemberBoards, setTotalMemberBoards] = useState(0)
  const [loadingOwner, setLoadingOwner] = useState(false)
  const [loadingMember, setLoadingMember] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)

  useEffect(() => {
    Promise.all([fetchBoardsAPI(location.search), getRecentBoards()])
      .then(([boardsRes, recentRes]) => {
        setOwnerBoards(boardsRes.ownerBoards || [])
        setMemberBoards(boardsRes.memberBoards || [])
        setTotalOwnerBoards(boardsRes.totalOwnerBoards || 0)
        setTotalMemberBoards(boardsRes.totalMemberBoards || 0)
        setRecentBoards(recentRes || [])
      })
      .finally(() => setLoadingInitial(false))
  }, [location.search])

  useEffect(() => {
    if (!loadingInitial) {
      setLoadingOwner(true)
      fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage}`)
        .then(res => {
          setOwnerBoards(res.ownerBoards || [])
          setTotalOwnerBoards(res.totalOwnerBoards || 0)
        })
        .finally(() => setLoadingOwner(false))
    }
  }, [ownerPage])

  useEffect(() => {
    if (!loadingInitial) {
      setLoadingMember(true)
      fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage}`)
        .then(res => {
          setMemberBoards(res.memberBoards || [])
          setTotalMemberBoards(res.totalMemberBoards || 0)
        })
        .finally(() => setLoadingMember(false))
    }
  }, [memberPage])

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(res => {
      setOwnerBoards(res.ownerBoards || [])
      setMemberBoards(res.memberBoards || [])
      setTotalOwnerBoards(res.totalOwnerBoards || 0)
      setTotalMemberBoards(res.totalMemberBoards || 0)
    })
  }

  const renderBoardGrid = (boardsList, isLoading) => {
    const placeholderCount = 6
    const displayList = isLoading ? Array(placeholderCount).fill(null) : boardsList

    return (
      <Grid container spacing={2} minHeight={160}>
        {displayList.map((b, index) => (
          <Grid xs={12} sm={6} md={4} lg={2} key={b?._id || index}>
            <Card
              component={b ? Link : 'div'}
              to={b ? `/boards/${b._id}` : undefined}
              sx={{
                width: '100%',
                height: 140,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderRadius: 2,
                boxShadow: 3,
                textDecoration: 'none',
                transition: '0.25s',
                cursor: b ? 'pointer' : 'default',
                '&:hover': b && { transform: 'translateY(-4px)', boxShadow: 6 },
                bgcolor: theme => theme.palette.mode === 'dark' ? '#242b34' : '#ffffff'
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton variant="rectangular" height={60} animation="wave" />
                  <CardContent sx={{ p: 1.5 }}>
                    <Skeleton variant="text" width="60%" />
                    <Skeleton variant="text" width="40%" />
                  </CardContent>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      height: 60,
                      backgroundColor: getBoardColor(b._id),
                      borderTopLeftRadius: 8,
                      borderTopRightRadius: 8
                    }}
                  />
                  <CardContent sx={{ p: 1.5 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.95rem',
                        mb: 0.3,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {b?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {b.type === 'public' ? t('public') : t('private')}
                    </Typography>
                  </CardContent>
                </>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>
    )
  }

  const getBoardColor = (boardId) => {
    if (!colorCache.current[boardId]) {
      colorCache.current[boardId] = randomColor({ luminosity: 'light' })
    }
    return colorCache.current[boardId]
  }

  if (loadingInitial) return <PageLoadingSpinner caption={t('loading')} AppBar={true} />

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      <Box
        sx={theme => ({
          px: { xs: 2, sm: 10, md: 20 },
          pt: 2,
          pb: 4,
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
          ...getScrollbarStyles(theme)
        })}
      >
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SpaceDashboardIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {t('ownedBoards')}
              </Typography>
            </Box>
            <SidebarCreateBoardModal afterCreateNewBoard={afterCreateNewBoard} />
          </Box>

          {ownerBoards.length === 0 && !loadingOwner && (
            <Typography color="text.secondary">{t('no_boards')}</Typography>
          )}
          {renderBoardGrid(ownerBoards, loadingOwner)}

          {totalOwnerBoards > DEFAULT_ITEMS_PER_PAGE && (
            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                size="large"
                color="primary"
                count={Math.ceil(totalOwnerBoards / DEFAULT_ITEMS_PER_PAGE)}
                page={ownerPage}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/boards?ownerPage=${item.page}&memberPage=${memberPage}`}
                    {...item}
                  />
                )}
              />
            </Box>
          )}
        </Box>

        <Box sx={{ mb: recentBoards.length > 0 ? 3 : 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <GroupIcon color="secondary" />
            <Typography variant="h6" sx={{ fontWeight: 600 }}>{t('sharedBoards')}</Typography>
          </Box>
          {memberBoards.length === 0 && !loadingMember && (
            <Typography color="text.secondary">{t('no_boards')}</Typography>
          )}
          {renderBoardGrid(memberBoards, loadingMember)}

          {totalMemberBoards > DEFAULT_ITEMS_PER_PAGE && (
            <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
              <Pagination
                size="large"
                color="secondary"
                count={Math.ceil(totalMemberBoards / DEFAULT_ITEMS_PER_PAGE)}
                page={memberPage}
                renderItem={(item) => (
                  <PaginationItem
                    component={Link}
                    to={`/boards?ownerPage=${ownerPage}&memberPage=${item.page}`}
                    {...item}
                  />
                )}
              />
            </Box>
          )}
        </Box>

        {recentBoards.length > 0 && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <AccessTimeIcon />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>{t('recently_viewed')}</Typography>
            </Box>
            {renderBoardGrid(recentBoards, false)}
          </Box>
        )}
      </Box>
    </Container>
  )
}

export default Boards
