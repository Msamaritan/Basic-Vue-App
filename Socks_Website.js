let eventBus = new Vue()

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
            reviews : [],
            onSale : true
        }
    },
    methods : {
        addToCart : function(){
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantID);
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
    //Lifecycle Hook, mounted() is used to implement as soon as the component is mounted to the DOM
    mounted() {
        eventBus.$on('reviewSubmitted', productReview => {
            this.reviews.push(productReview);
        })
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
        <p v-if="premium">Shipping is free</p>
        <p v-else>Shipping : $2.99</p>

        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
        <div v-for="(variant, index) in variants" v-bind:key="variant.variantID"
             class = "color-box"
             :style = "{backgroundColor : variant.variantColour}"
             @mouseover="updateProduct(index)"> <!--Its always good practice to bind the key for vue to keep track-->

        </div>
        <button v-on:click="addToCart" v-bind:disabled="!inStock"
                v-bind:class="{ disabledButton: !inStock}">Add to Cart
        </button>
    </div>
    <product-tabs :reviews="reviews"></product-tabs>
    
</div>
    `
})

Vue.component('product-review',{
    template : `
 
    <form class="review-form" v-on:submit.prevent="onSubmit">
        <p v-if="errors.length">
            <strong>Please correct the following error(s):</strong>
            <ul>
                <li v-for="error in errors">
                    {{ error }}
                <li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <textarea id="name" v-model="name" ></textarea>
        </p>

        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review" ></textarea>
        </p>

        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>

        <p>
            <input type="submit" value="submit">
        </p>
    </form>
    `,
    data : function(){
        return {
            name : null,
            review : null,
            rating : null,
            errors : []
        }
    },
    methods : {
        onSubmit : function(){
            if (this.name && this.review && this.rating){
                let productReview = {
                    name : this.name,
                    review : this.review,
                    rating : this.rating
                }
                eventBus.$emit("reviewSubmitted", productReview)
                this.name = "";
                this.rating = "";
                this.review = "";
            }
            else {
                if(!this.name) this.errors.push("Name Required")
                if(!this.review) this.errors.push("Review Required")
                if(!this.rating) this.errors.push("Rating Required")
            } 
        }
    }
})

Vue.component('product-tabs',{
    props : {
        reviews :{
            type : Array,
            required : true
        }
    },
    template : `
        <div>
            <span class="tab"
                  :class="{ activeTab : selectedTab === tab}"
                  v-for="(tab, index) in tabs" v-bind:key="index"
                  v-on:click="selectedTab = tab">
                  {{ tab }} 
            </span>
            
        
            <div v-show="selectedTab === 'Reviews'">
            <h3>Reviews</h3>
            <p v-if="!reviews.length">There are no reviews yet! </p>
            <ul>
                <li v-for="review in reviews">
                <p>{{ review.name }} </p>
                <p>Review: {{ review.review }} </p>
                <p>Rating: {{ review.rating }} </p>
                </li>
            </ul>
            </div>
            <product-review v-show="selectedTab === 'Make a Review'"></product-review>
        </div>

    `,
    data() {
        return {
            tabs : ['Reviews', 'Make a Review'],
            selectedTab : 'Reviews'
        }
    }
})

let app = new Vue({
    el : '#app',
    data : {
        premium : true,
        cart : []
    },
    methods : {
        updateCart : function (id) {
            this.cart.push(id);
        }
    }
})