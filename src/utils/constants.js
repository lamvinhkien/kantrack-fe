let apiRoot = ''
let webDomain = ''

if (process.env.BUILD_MODE === 'production') apiRoot = 'http://localhost:8017'
if (process.env.BUILD_MODE === 'production') webDomain = 'https://kantrack.io.vn'
if (process.env.BUILD_MODE === 'dev') apiRoot = 'http://localhost:8017'
if (process.env.BUILD_MODE === 'dev') webDomain = 'http://localhost:5173'

export const API_ROOT = apiRoot
export const WEB_DOMAIN = webDomain

export const DEFAULT_PAGE = 1
export const DEFAULT_ITEMS_PER_PAGE = 6

export const CARD_MEMBER_ACTIONS = { ADD: 'ADD', REMOVE: 'REMOVE' }

export const CARD_ATTACHMENT_ACTIONS = { EDIT: 'EDIT', REMOVE: 'REMOVE' }

export const CARD_COMMENT_ACTIONS = { ADD: 'ADD', EDIT: 'EDIT', REMOVE: 'REMOVE' }

export const BOARD_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private'
}

export const BOARD_INVITATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
}

export const BOARD_MEMBER_ACTIONS = {
  editBoardTitle: 'editBoardTitle',
  editBoardType: 'editBoardType',
  inviteMemberToBoard: 'inviteMemberToBoard',

  addColumn: 'addColumn',
  editColumnTitle: 'editColumnTitle',
  deleteColumn: 'deleteColumn',
  moveColumn: 'moveColumn',

  addCard: 'addCard',
  editCardTitle: 'editCardTitle',
  editCardDescription: 'editCardDescription',
  editCardCover: 'editCardCover',
  editCardMember: 'editCardMember',
  editCardDate: 'editCardDate',
  editCardAttachment: 'editCardAttachment',
  editCardComment: 'editCardComment',
  editCardMarkComplete: 'editCardMarkComplete',
  deleteCard: 'deleteCard',
  moveCard: 'moveCard'
}