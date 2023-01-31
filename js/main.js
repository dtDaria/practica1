Vue.component('product-review', {
    template: `

   <form class="review-form" @submit.prevent="onSubmit">
 <p>
   <label for="name">Name:</label>
   <input id="name" v-model="name" placeholder="name">
 </p>

 <p>
   <label for="review">Review:</label>
   <textarea id="review" v-model="review"></textarea>
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
   <input type="submit" value="Submit"> 
 </p>

</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null
        }
    },
    methods:{
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                reviews: []
            }
            this.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
        },
        addReview(productReview) {
            this.reviews.push(productReview)
        }
    }

})


Vue.component('product-details',{
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:
        `<ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>`
})

Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
   <div class="product">
	<div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>
        <div class="product-info">
            <h1>{{ title }} </h1> <!-- загаловок -->
            <p>{{ description }} <a :href="link">More products like this</a></p> <!-- Ссылка на магазин -->
            <span v-if="onSale">{{sale}}</span> <!-- товар находится на скидке -->
            <span v-else>noSale</span> <!-- товар не находится на скидке -->
            <p v-if="inStock">In stock</p> <!-- товар нахдится в наличии -->
            <p v-else :class="{outOfStock: !instock}">Out of stock</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li> <!-- состав -->
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <!-- цвет -->
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>
            <ul>
                <li v-for="size in sizes">{{size}}</li><!-- размеры -->
            </ul>
            <button v-on:click="addToCart" :disabled="!inStock"
                    :class="{ disabledButton: !inStock }">Add to cart</button><!-- добавить в кор -->
            <button v-on:click="removeCart">Remove Cart</button>


        </div>
   </div>
 `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            description: "A pair of warm, fuzzy socks",
            selectedVariant: 0,
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: true,
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],

            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                    variantOnSale: "on Sale",
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite (1).jpg",
                    variantQuantity: 0,
                    variantOnSale: "Want to buy? Wait a little bit",
                }
            ],
            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            OnSale:"on Sale",
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },
        removeCart() {
            this.$emit('remove-from-cart',
                this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock(){
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale(){
            return this.brand + '  ' + this.product + '  ' + this.variants[this.selectedVariant].variantOnSale;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        },

    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },
        removeCart(id) {
            for(let i = this.cart.length - 1; i >= 0; i--){
                if(this.cart[i] === id){
                    this.cart.splice(i,1)
                }
            }
        }
    },


})





 
 