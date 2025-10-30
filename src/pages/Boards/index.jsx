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
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import { getScrollbarStyles } from '~/utils/formatters'
import Footer from '~/components/Footer/Footer'
import StarIcon from '@mui/icons-material/Star'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { socketIoInstance } from '~/socketio/socketClient'
import { toast } from 'react-toastify'

const Boards = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  const ownerPage = parseInt(query.get('ownerPage') || DEFAULT_PAGE, 10)
  const memberPage = parseInt(query.get('memberPage') || DEFAULT_PAGE, 10)
  const favouritePage = parseInt(query.get('favouritePage') || DEFAULT_PAGE, 10)
  const colorCache = useRef({})
  const modalRef = useRef(null)
  const currentUser = useSelector(selectCurrentUser)

  const [ownerBoards, setOwnerBoards] = useState([])
  const [memberBoards, setMemberBoards] = useState([])
  const [recentBoards, setRecentBoards] = useState([])
  const [favouriteBoards, setFavouriteBoards] = useState([])
  const [totalOwnerBoards, setTotalOwnerBoards] = useState(0)
  const [totalMemberBoards, setTotalMemberBoards] = useState(0)
  const [totalFavouriteBoards, setTotalFavouriteBoards] = useState(0)
  const [loadingOwner, setLoadingOwner] = useState(false)
  const [loadingMember, setLoadingMember] = useState(false)
  const [loadingFavourite, setLoadingFavourite] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)

  useEffect(() => {
    if (!socketIoInstance) return

    const onDeletedBoardGlobal = async (deletedBoardId) => {
      try {
        let didRemoveAny = false

        if (ownerBoards.some(b => b._id === deletedBoardId)) {
          didRemoveAny = true
          const newOwner = ownerBoards.filter(b => b._id !== deletedBoardId)

          if (newOwner.length === 0 && ownerPage > 1) {
            const res = await fetchBoardsAPI(`?ownerPage=${ownerPage - 1}&memberPage=${memberPage}&favouritePage=${favouritePage}`)
            setOwnerBoards(res.ownerBoards || [])
            setTotalOwnerBoards(res.totalOwnerBoards || 0)
          } else {
            setOwnerBoards(newOwner)
            setTotalOwnerBoards(prev => Math.max(0, prev - 1))
          }
        }

        if (memberBoards.some(b => b._id === deletedBoardId)) {
          didRemoveAny = true
          const newMember = memberBoards.filter(b => b._id !== deletedBoardId)

          if (newMember.length === 0 && memberPage > 1) {
            const res = await fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage - 1}&favouritePage=${favouritePage}`)
            setMemberBoards(res.memberBoards || [])
            setTotalMemberBoards(res.totalMemberBoards || 0)
          } else {
            setMemberBoards(newMember)
            setTotalMemberBoards(prev => Math.max(0, prev - 1))
          }
        }

        if (favouriteBoards.some(b => b._id === deletedBoardId)) {
          didRemoveAny = true
          const newFav = favouriteBoards.filter(b => b._id !== deletedBoardId)

          if (newFav.length === 0 && favouritePage > 1) {
            const res = await fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage}&favouritePage=${favouritePage - 1}`)
            setFavouriteBoards(res.favouriteBoards || [])
            setTotalFavouriteBoards(res.totalFavouriteBoards || 0)
          } else {
            setFavouriteBoards(newFav)
            setTotalFavouriteBoards(prev => Math.max(0, prev - 1))
          }
        }

        if (recentBoards.some(b => b._id === deletedBoardId)) {
          didRemoveAny = true
          setRecentBoards(prev => prev.filter(b => b._id !== deletedBoardId))
        }

        if (didRemoveAny) {
          toast.info(t('board_removed_realtime'))
        }
      } catch (err) {
        setOwnerBoards(prev => prev.filter(b => b._id !== deletedBoardId))
        setMemberBoards(prev => prev.filter(b => b._id !== deletedBoardId))
        setFavouriteBoards(prev => prev.filter(b => b._id !== deletedBoardId))
        setRecentBoards(prev => prev.filter(b => b._id !== deletedBoardId))
      }
    }

    socketIoInstance.on('BE_DELETE_BOARD_GLOBAL', onDeletedBoardGlobal)

    return () => {
      socketIoInstance.off('BE_DELETE_BOARD_GLOBAL', onDeletedBoardGlobal)
    }
  }, [
    socketIoInstance,
    ownerBoards,
    memberBoards,
    favouriteBoards,
    recentBoards,
    ownerPage,
    memberPage,
    favouritePage,
    t
  ])

  useEffect(() => {
    const hasRecent = currentUser?.recentBoards?.length > 0

    Promise.all([
      fetchBoardsAPI(location.search),
      hasRecent ? getRecentBoards() : Promise.resolve([])
    ])
      .then(([boardsRes, recentRes]) => {
        setOwnerBoards(boardsRes.ownerBoards || [])
        setMemberBoards(boardsRes.memberBoards || [])
        setFavouriteBoards(boardsRes.favouriteBoards || [])
        setTotalOwnerBoards(boardsRes.totalOwnerBoards || 0)
        setTotalMemberBoards(boardsRes.totalMemberBoards || 0)
        setTotalFavouriteBoards(boardsRes.totalFavouriteBoards || 0)
        setRecentBoards(recentRes || [])
      })
      .finally(() => setLoadingInitial(false))
  }, [location.search, currentUser])

  useEffect(() => {
    if (!loadingInitial) {
      setLoadingOwner(true)
      fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage}&favouritePage=${favouritePage}`)
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
      fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage}&favouritePage=${favouritePage}`)
        .then(res => {
          setMemberBoards(res.memberBoards || [])
          setTotalMemberBoards(res.totalMemberBoards || 0)
        })
        .finally(() => setLoadingMember(false))
    }
  }, [memberPage])

  useEffect(() => {
    if (!loadingInitial) {
      setLoadingFavourite(true)
      fetchBoardsAPI(`?ownerPage=${ownerPage}&memberPage=${memberPage}&favouritePage=${favouritePage}`)
        .then(res => {
          setFavouriteBoards(res.favouriteBoards || [])
          setTotalFavouriteBoards(res.totalFavouriteBoards || 0)
        })
        .finally(() => setLoadingFavourite(false))
    }
  }, [favouritePage])

  const getBoardColor = (boardId) => {
    if (!colorCache.current[boardId]) {
      colorCache.current[boardId] = randomColor({ luminosity: 'light' })
    }
    return colorCache.current[boardId]
  }

  const afterCreateNewBoard = () => {
    fetchBoardsAPI(location.search).then(res => {
      setOwnerBoards(res.ownerBoards || [])
      setMemberBoards(res.memberBoards || [])
      setTotalOwnerBoards(res.totalOwnerBoards || 0)
      setTotalMemberBoards(res.totalMemberBoards || 0)
    })
  }

  const renderBoardGrid = (boardsList, isLoading, allowCreateFallback = false) => {
    const placeholderCount = 6
    const displayList = isLoading ? Array(placeholderCount).fill(null) : boardsList

    return (
      <Grid container spacing={2} minHeight={160}>
        {displayList.length > 0 ? (
          displayList.map((b, index) => (
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
          ))
        ) : (
          allowCreateFallback && !isLoading && (
            <Grid xs={12} sm={6} md={4} lg={2}>
              <Box
                sx={{
                  width: '100%',
                  height: 140,
                  borderRadius: 2,
                  boxShadow: 3,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  bgcolor: theme => theme.palette.mode === 'dark' ? '#2e3640' : '#f4f6f8',
                  transition: '0.25s',
                  '&:hover': {
                    bgcolor: theme => theme.palette.mode === 'dark' ? '#3b4652' : '#e9ecef',
                    transform: 'translateY(-3px)'
                  }
                }}
                onClick={() => modalRef.current?.openModal()}
              >
                <AddIcon fontSize="large" color="primary" />
                <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 600 }}>
                  {t('create_board')}
                </Typography>
              </Box>
            </Grid>
          )
        )}
      </Grid>
    )
  }

  return (
    <Container disableGutters maxWidth={false}>
      <AppBar />
      {
        loadingInitial
          ?
          <PageLoadingSpinner caption={t('loading')} AppBar={true} />
          :
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
            <Box sx={{ minHeight: '500px', mb: 6 }}>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpaceDashboardIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('owned_boards')}
                    </Typography>
                  </Box>

                  {ownerBoards.length > 0 && (
                    <SidebarCreateBoardModal ref={modalRef} afterCreateNewBoard={afterCreateNewBoard} />
                  )}
                </Box>

                {renderBoardGrid(ownerBoards, loadingOwner, true)}

                {totalOwnerBoards > DEFAULT_ITEMS_PER_PAGE && (
                  <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                    <Pagination
                      disabled={loadingOwner}
                      size="large"
                      color="primary"
                      count={Math.ceil(totalOwnerBoards / DEFAULT_ITEMS_PER_PAGE)}
                      page={ownerPage}
                      renderItem={(item) => (
                        <PaginationItem
                          component={Link}
                          to={`/boards?ownerPage=${item.page}&memberPage=${memberPage}&favouritePage=${favouritePage}`}
                          {...item}
                        />
                      )}
                    />
                  </Box>
                )}
              </Box>

              {memberBoards.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <GroupIcon color="secondary" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('joined_boards')}
                    </Typography>
                  </Box>

                  {renderBoardGrid(memberBoards, loadingMember, false)}

                  {totalMemberBoards > DEFAULT_ITEMS_PER_PAGE && (
                    <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                      <Pagination
                        disabled={loadingMember}
                        size="large"
                        color="secondary"
                        count={Math.ceil(totalMemberBoards / DEFAULT_ITEMS_PER_PAGE)}
                        page={memberPage}
                        renderItem={(item) => (
                          <PaginationItem
                            component={Link}
                            to={`/boards?ownerPage=${ownerPage}&memberPage=${item.page}&favouritePage=${favouritePage}`}
                            {...item}
                          />
                        )}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {favouriteBoards.length > 0 && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StarIcon color="warning" />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('favourite')}
                    </Typography>
                  </Box>

                  {renderBoardGrid(favouriteBoards, loadingFavourite, false)}

                  {totalFavouriteBoards > DEFAULT_ITEMS_PER_PAGE && (
                    <Box sx={{ my: 3, display: 'flex', justifyContent: 'center' }}>
                      <Pagination
                        disabled={loadingFavourite}
                        size="large"
                        count={Math.ceil(totalFavouriteBoards / DEFAULT_ITEMS_PER_PAGE)}
                        page={favouritePage}
                        renderItem={(item) => (
                          <PaginationItem
                            component={Link}
                            to={`/boards?ownerPage=${ownerPage}&memberPage=${memberPage}&favouritePage=${item.page}`}
                            {...item}
                          />
                        )}
                        sx={{
                          '& .MuiPaginationItem-root': {
                            transition: 'all 0.2s ease',
                            color: (theme) => theme.palette.text.primary,
                            '&:hover': {
                              backgroundColor: (theme) => theme.palette.action.hover
                            },
                            '&.Mui-selected': {
                              backgroundColor: (theme) => loadingFavourite ? theme.palette.divider : theme.palette.warning.main,
                              color: (theme) => loadingFavourite ? theme.palette.grey[500] : theme.palette.getContrastText(theme.palette.warning.main),

                              '&:hover': {
                                backgroundColor: (theme) => theme.palette.warning.dark
                              }
                            }
                          }
                        }}
                      />
                    </Box>
                  )}
                </Box>
              )}

              {recentBoards.length > 0 && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <AccessTimeIcon />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {t('recently_viewed')}
                    </Typography>
                  </Box>
                  {renderBoardGrid(recentBoards, false, false)}
                </Box>
              )}

              <SidebarCreateBoardModal
                ref={modalRef}
                afterCreateNewBoard={afterCreateNewBoard}
                sx={{ display: 'none' }}
              />
            </Box>

            <Footer lineWidth={'100%'} />
          </Box>
      }
    </Container>
  )
}

export default Boards
