<template>
    <b-row style="justify-content: center;">
        <b-col cols="12" class="padding-box">
            <div class="content-box title">
                <h1>Error</h1>
                <div class="black-line"></div>
                <div class="red-line"></div>
            </div>
        </b-col>

        <b-col cols="12" class="padding-box">
            <div class="content-box notfound">
                <h2>{{ $t('error.title') }}</h2>
                <p>{{ $t('error.subtitle') }}</p>

                <router-link class="nav-link accept" to="/">
                    {{ $t('error.button') }}
                </router-link>
                
            </div>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: 'Error',

}
</script>

<style scoped src="@/assets/css/error.css">
</style>