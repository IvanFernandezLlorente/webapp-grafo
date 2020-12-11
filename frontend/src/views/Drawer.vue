<template>
  <div class="sidebar">
    <b-navbar class="sidebar-wrapper" toggleable="lg" type="dark">
        <b-navbar-brand href="#">NavBar</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="list">
            <b-nav-item class="nav-link" to="/people">
                <b-icon-file-person></b-icon-file-person>
                <p>People</p>
            </b-nav-item>
            <b-nav-item class="nav-link" to="/publications">
                <b-icon-chat-dots-fill></b-icon-chat-dots-fill>
                <p>Publications</p>
            </b-nav-item>
        </b-navbar-nav>
        </b-collapse>
    </b-navbar>
 </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.sidebar{
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 265px;
    display: block;
    z-index: 1;
    color: #fff;
    font-weight: 200;
    background-size: cover;
    background-position: 50%;
}

.sidebar-wrapper{
    position: relative;
    max-height: calc(100vh - 75px);
    min-height: 100%;
    overflow: auto;
    width: 265px;
    z-index: 4;
    padding-bottom: 100px;
    display: block;
    background: #000;
    opacity: 0.7;
}

.list{
    margin-top: 20px;
    float: none;
    display: block;
    width: 100%;
}

li.nav-link{
    padding: 0px !important;
}

a.nav-link{
    color: #fff;
    margin: 5px 15px;
    opacity: .86;
    border-radius: 4px;
    display: block;
    padding: 10px 15px !important;
    text-transform: uppercase;
    line-height: 30px;
    font-size: 12px;
    font-weight: 600;
}

svg {
    font-size: 28px !important;
    margin-right: 15px;
    width: 30px;
    text-align: center;
    float: left;
}

</style>