<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
</style>

<script>
	export default {
		data(){
			return {
				
			}
		},
		onLaunch: function() {
			this.onHotUpdate()
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
			onHotUpdate(){ // 热更新
				if(wx.canIUse('getUpdateManager')){
					const updateManager = uni.getUpdateManager()
					const self = this
					
					updateManager.onCheckForUpdate(function (res) {
					  // 请求完新版本信息的回调
						if(res.hasUpdate){
							updateManager.onUpdateReady(function (res) {
							  uni.showModal({
							    title: '更新提示',
							    content: '新版本已经准备好，是否重启应用？',
							    success(res) {
							      if (res.confirm) {
							        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							        updateManager.applyUpdate();
							      }else if(res.cancel){
											self.autoUpdate()
										}
							    }
							  })
							})
							
							updateManager.onUpdateFailed(function (res) {
							  // 新的版本下载失败
								uni.showModal({
								 title: '已经有新版本了哟~',
								 content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
								})
							})
						}else{
							return 
						}
					})
				}
			}
		}
	}
</script>

<style>
	/*每个页面公共css */
	@import "@/assets/icon/iconfont-weapp/iconfont-weapp-icon.css";
	@import "@/assets/icon/iconfont.css";
</style>
