import { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { fetchBoardsAPI } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { useTranslation } from 'react-i18next'

const AutoCompleteSearchBoard = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [boards, setBoards] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) { setBoards(null) }
  }, [open])

  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return

    const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    setLoading(true)

    fetchBoardsAPI(searchPath)
      .then(res => setBoards(res.boards || []))
      .finally(() => setLoading(false))
  }

  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 700)

  const handleSelectedBoard = (event, selectedBoard) => {
    if (selectedBoard) navigate(`/boards/${selectedBoard._id}`)
  }

  return (
    <Autocomplete
      sx={{ width: '100%' }}
      id="asynchronous-search-board"
      noOptionsText={!boards ? t('type_to_sreach') : t('not_found')}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      open={open}
      onOpen={() => { setOpen(true) }}
      onClose={() => { setOpen(false) }}
      getOptionLabel={(board) => board.title}
      options={boards || []}
      loading={loading}
      onInputChange={debounceSearchBoard}
      onChange={handleSelectedBoard}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={t('search_board')}
          size="small"
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading && <CircularProgress sx={{ color: 'white' }} size={20} />}
              </>
            )
          }}
          sx={{
            '& input': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { border: 'none' },
              '&:hover fieldset': { border: 'none' },
              '&.Mui-focused fieldset': { border: 'none' },
              borderBottom: '1px solid rgba(255,255,255,0.3)'
            },
            '& .MuiSvgIcon-root': { color: 'white' }
          }}
        />
      )}
    />
  )
}

export default AutoCompleteSearchBoard
