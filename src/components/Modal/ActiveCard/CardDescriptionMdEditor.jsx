import { useState } from 'react'
import { useColorScheme } from '@mui/material/styles'
import MDEditor from '@uiw/react-md-editor'
import rehypeSanitize from 'rehype-sanitize'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import EditNoteIcon from '@mui/icons-material/EditNote'

const markdownValueExample = `
  \\*\\*Markdown Content Example:\\*\\*

  **Hello world | TrungQuanDev - Một Lập Trình Viên | Trello MERN Stack Advanced**
  ![TrungQuanDev-Avatar](https://avatars.githubusercontent.com/u/14128099?v=4&s=80)

  \`\`\`javascript
  import React from "react"
  import ReactDOM from "react-dom"
  import MDEditor from '@uiw/react-md-editor'
  \`\`\`
`

const CardDescriptionMdEditor = () => {
  const { mode } = useColorScheme()

  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(markdownValueExample)

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode
        ?
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview="edit"
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={updateCardDescription}
            className="interceptor-loading"
            type="button"
            variant="contained"
            size="small"
            color="info"
          >
            Save
          </Button>
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
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: '10px',
                border: '0.5px solid rgba(0, 0, 0, 0.2)',
                borderRadius: '8px'
              }}
            />
          </Box>
        </Box>
      }
    </Box>
  )
}

export default CardDescriptionMdEditor
