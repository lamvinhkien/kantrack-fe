import { useState, useEffect } from 'react'
import { useColorScheme } from '@mui/material/styles'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'
import { useTranslation } from 'react-i18next'
import { BoardPermissionGate } from '~/components/common/BoardPermissionGate'
import { BOARD_MEMBER_ACTIONS } from '~/utils/constants'

const DescriptionMdEditor = ({ cardDescriptionProp, handleUpdateCardDescription }) => {
  const { mode } = useColorScheme()
  const { t } = useTranslation()
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(cardDescriptionProp)

  const updateCardDescription = () => {
    if (cardDescription.trim() === cardDescriptionProp?.trim()) {
      setMarkdownEditMode(false)
      return
    }
    setMarkdownEditMode(false)
    handleUpdateCardDescription(cardDescription)
  }

  useEffect(() => {
    setCardDescription(cardDescriptionProp)
  }, [cardDescriptionProp])

  return (
    <Box sx={{ mt: -4 }}>
      <BoardPermissionGate
        action={BOARD_MEMBER_ACTIONS.editCardDescription}
        fallback={
          <Box data-color-mode={mode} sx={{ mt: 6, ml: 0.5 }}>
            <MDEditor.Markdown
              source={cardDescription ? cardDescription : t('no_description')}
              style={{ backgroundColor: 'transparent' }}
            />
          </Box>
        }
      >
        {markdownEditMode
          ?
          <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box data-color-mode={mode}>
              <MDEditor
                value={cardDescription}
                onChange={setCardDescription}
                previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
                height={220}
                preview='edit'
              />
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
              <Button
                onClick={() => {
                  setCardDescription(cardDescriptionProp)
                  setMarkdownEditMode(false)
                }}
                type="button"
                variant="text"
                size="small"
                color="inherit"
              >
                {t('cancel')}
              </Button>
              <Button
                onClick={updateCardDescription}
                className="interceptor-loading"
                type="button"
                variant="contained"
                size="small"
                color="info"
                disabled={cardDescription ? false : true}
              >
                {t('save')}
              </Button>
            </Box>
          </Box>
          :
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              sx={{ alignSelf: 'flex-end' }}
              onClick={() => setMarkdownEditMode(true)}
              type="button"
              variant="contained"
              color="info"
              size="small"
              startIcon={<EditNoteIcon />}
            >
              {t('edit')}
            </Button>
            <Box
              data-color-mode={mode}
              sx={cardDescription ? {} : { cursor: 'pointer' }}
              onClick={() => { if (!cardDescription) setMarkdownEditMode(true) }}
            >
              <MDEditor.Markdown
                source={cardDescription ? cardDescription : t('add_description')}
                style={{
                  whiteSpace: 'pre-wrap',
                  padding: !cardDescription ? '12px' : '0px',
                  border: !cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                  borderRadius: '8px',
                  backgroundColor: !cardDescription ? mode === 'dark' && 'rgba(0, 0, 0, 0.2)' : 'inherit'
                }}
              />
            </Box>
          </Box>
        }
      </BoardPermissionGate>
    </Box>
  )
}

export default DescriptionMdEditor
