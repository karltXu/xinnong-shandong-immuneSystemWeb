<template>
  <div class="tinymce-container">
    <editor
      :init="init"
      api-key="8y3qj6j9pdjgvcu6a00ocm6nxov7mz43rq3q4dv2o7u5khz1"
      :value="value"
      @input="$emit('updateEditor', $event)"
    />
  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import Editor from '@tinymce/tinymce-vue'
import { getStsConfig, clientConstrctor } from '@/api/oss'

const useDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
let client
getStsConfig().then((res) => {
    const { bucket, region, stsToken } = res.data
    client = clientConstrctor(bucket, region, stsToken)
})

export default {
    model: {
      prop: 'value',
      event: 'updateEditor'
    },
    name: 'MyTinymce',
    components: {
        Editor
    },
    props: {
      value: {
        type: String,
        default: ''
      }
    },
    data() {
        return {
            init: {
                language: 'zh_CN',
                height: 500,
                width: 780,
                selector: 'textarea#open-source-plugins',
                plugins:
                    'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
                editimage_cors_hosts: ['picsum.photos'],
                menubar: 'file edit view insert format tools table help',
                toolbar:
                    'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media table template link anchor codesample | ltr rtl',
                // toolbar_sticky: true,
                // toolbar_sticky_offset: isSmallScreen ? 102 : 108,
                autosave_ask_before_unload: true,
                autosave_interval: '30s',
                autosave_prefix: '{path}{query}-{id}-',
                autosave_restore_when_empty: false,
                autosave_retention: '2m',
                importcss_append: true,
                images_upload_handler: function (blobInfo, success, failure) {
                    var filename = blobInfo.filename()
                    filename = 'user-content/ops/' + uuidv4() + '-' + filename
                    client
                        .multipartUpload(filename, blobInfo.blob())
                        .then(function (result) {
                            console.log('fucking->result: ', result)
                            console.log('fucking->result.res: ', result.res)
                            console.log('fucking->result.res.requestUrls: ', result.res.requestUrls)
                            if (result.res.requestUrls) {
                                console.log('oss img src: ', 'https://assets.aibcxw.com/' + filename)
                                success('https://assets.aibcxw.com/' + filename)
                            }
                        })
                        .catch(function (err) {
                            console.log(err)
                        })
                },
                template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
                template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
                quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
                // quickbars_insert_toolbar: 'quickimage quicktable',
                quickbars_insert_toolbar: '',
                noneditable_class: 'mceNonEditable',
                toolbar_mode: 'wrap',
                contextmenu: 'link image table',
                skin: useDarkMode ? 'oxide-dark' : 'oxide',
                content_css: useDarkMode ? 'dark' : 'default',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
            }
        }
    }
}
</script>
<style lang="scss" scoped>
</style>
