import Clipboard from 'clipboard'

function clipboardSuccess() {
  this.$message.success("复制成功");
}

function clipboardError() {
  this.$message.error("复制失败");
}

export default function handleClipboard(text, event) {
  const clipboard = new Clipboard(event.target, {
    text: () => String(text)
  })
  clipboard.on('success', () => {
    clipboardSuccess()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.on('error', () => {
    clipboardError()
    clipboard.off('error')
    clipboard.off('success')
    clipboard.destroy()
  })
  clipboard.onClick(event)
}
