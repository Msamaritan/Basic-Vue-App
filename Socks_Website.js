Vue.component('product',{
    props : {
        premium : {
            type : Boolean,
            required : true 
        }
    },
    data() {
        return {
            brand : 'Johnny',
            product : 'Socks',
            selectedVariant : 0,
            inventory : 100,
            details : ["80% Cotton","20% Polyester", "Gender-Neutral"],
            variants : [
                {
                    variantID : 101,
                    variantColour : "Green",
                    variantImage : "./greensock.jpg",
                    variantQty : 10
                },
                {
                    variantID : 102,
                    variantColour : "Blue",
                    variantImage : "./bluesock.jpg",
                    variantQty : 0
                }
            ],
            cart : 0,
            onSale : true
        }
    },
    methods : {
        addToCart : function(){
            this.cart += 1;
        },
        updateProduct : function(index){
            this.selectedVariant = index;
            
        }
    },
    computed : {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQty;
        },
        productColor(){
            return this.variants[this.selectedVariant].variantColour;
        },
        sale(){
            if(this.onSale){
                return this.brand+' '+this.product+' are on sale! YAY!!';
            }
            return this.brand+' '+this.product+' are not on sale! OOPS!!';
        }
        
    },
    template : `
    <div class="product">
    <div class="product-image">
        <img v-bind:src= "image">
    </div>

    <div class = "product-info">
        <h1>{{ title }}</h1>
        <p v-if="inStock && inventory > 10">In Stock</p>
        <p v-else-if="inStock &&inventory <=10 && inventory > 0">Almost Sold Out!</p>
        <p v-else>Out of Stock</p>
        <!--<p>{{ sale }}</p>-->
        <p>User is Premium : {{premium}}</p>

        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        <div v-for="(variant, index) in variants" v-bind:key="variant.variantID"
             class = "color-box"
             :style = "{backgroundColor : variant.variantColour}"
             @mouseover="updateProduct(index)"> <!--Its always good practice to bind the key for vue to keep track-->

            </div>
        <button v-on:click="addToCart" v-bind:disabled="!inStock"
                v-bind:class="{ disabledButton: !inStock}">Add to Cart</button>
        <div class="cart">
            <p> Cart ({{ cart }}) </p>
        </div>
    </div>
</div>
    `
})


let app = new Vue({
    el : '#app',
    data : {
        premium : true
    }
})