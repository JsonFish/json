import { uploadFileReq } from '@/api/file'
import { UrlInfo } from '@/api/file/type'
import { ElMessage } from 'element-plus'
import type { UploadUserFile } from 'element-plus'
// 上传单个文件返回对象格式
export const uploadFile: UrlInfo | any = async (fileList: UploadUserFile[]) => {
  if (fileList) {
    const form: any = new FormData()
    form.append('file', fileList[0].raw)
    return new Promise((rev, rej) => {
      uploadFileReq(form)
        .then((res) => {
          if (res.code == 200) return rev(res.data)
          ElMessage.info(res.message)
          return rej(res)
        })
        .catch((error) => rej(error))
    })
  }
}
