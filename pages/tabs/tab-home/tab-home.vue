<template>
	<view class="page-tab-home">
		<view class="banner-wrapper">
			<u-swiper
				:list="list"
				height="100vh"
				imgMode="aspectFill"
				circular
				:autoplay="true"
				bgColor="#fff"
				:indicator="true"
				indicatorMode="dot"
			></u-swiper>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					'https://img.freepik.com/free-vector/abstract-blue-particle-wave-points-array-background_1217-2633.jpg?t=st=1646648577~exp=1646649177~hmac=0aaac29a283b2b5d30b762e94f44b73e6d0bb8f60429b30fa238075143d5579a&w=2000',
					'https://img.freepik.com/free-vector/green-abstract-3d-big-data-visualization-with-dollar-symbol-intricate-financial-data-threads-analysis-business-analytics-representation-futuristic-infographics-aesthetic-design-finance-concept_1217-4389.jpg?t=st=1646647681~exp=1646648281~hmac=0c2f9b5febb9d5fe3b2388cadae5190e8fc14ef5770b483ee556993c5ed87522&w=2000',
					'https://img.freepik.com/free-photo/digital-world-map-hologram-blue-background_1379-901.jpg?t=st=1646647663~exp=1646648263~hmac=0f23886f5901ee6147e3a653dcbbea16cc33f42205c36ed6814d9387c2c8691b&w=2000',
					'https://img.freepik.com/free-photo/futuristic-smart-city-with-5g-global-network-technology_53876-98438.jpg?t=st=1646648473~exp=1646649073~hmac=066fb78ee896b7c67bd05d7b438bc4fe93110ae03f7c36ff7eacd8262618e673&w=1800',
				],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.page-tab-home{
	
}
</style>
