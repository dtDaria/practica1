let eventBus = new Vue()
Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
     <div>   
       <ul>
         <span class="tab"
               :class="{ activeTab: selectedTab === tab }"
               v-for="(tab, index) in tabs"
               @click="selectedTab = tab"
         >{{ tab }}</span>
       </ul>
       <div v-show="selectedTab === 'Reviews'">
         <p v-if="!reviews.length">There are no reviews yet.</p>
         <ul>
           <li v-for="review in reviews">
           <p>{{ review.name }}</p>
           <p>Rating: {{ review.rating }}</p>
           <p>Would you recommend this product: {{ review.question }}</p>
           <p>{{ review.review }}</p>
           </li>
         </ul>
       </div>
       <div v-show="selectedTab === 'Make a Review'">
         <product-review></product-review>  
       </div>
       
       <div v-show="selectedTab === 'Shipping'">
            <p>Shipping: {{ shipping }}</p>            
        </div>
            
       <div v-show="selectedTab === 'Details'">
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
       </div>
     </div>
`,

    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details' ],
            selectedTab: 'Reviews'  // устанавливается с помощью @click
        }
    }
})


Vue.component('product-review', {
    template: `
    
   <form class="review-form" @submit.prevent="onSubmit">
   <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
    <ul>
        <li v-for="error in errors">{{ error }}</li>
    </ul>
</p>
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
 
 <p>Would you recommend this product?</p>
  <div>
     <label for="question">Yes</label>
    <input type="radio" id="question" name="question" v-model="question" value="Yes">
    <label for="question">No</label>
    <input type="radio" id="question" name="question" v-model="question" value="No">
    
  </div>
 
 <p>
   <input type="submit" value="Submit"> 
 </p>
</form>
 `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
            question: null,
            errors: [],
        }
    },

methods: {
    onSubmit() {
        this.errors = []
        if (this.name && this.review && this.rating && this.question) {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                question: this.question
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
            this.question = null
        } else {
            if (!this.name) this.errors.push("Name required.")
            if (!this.review) this.errors.push("Review required.")
            if (!this.rating) this.errors.push("Rating required.")
            if (!this.question) this.errors.push("question required.")
        }

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
            <p v-else :class="{outOfStock: !inStock}">Out of stock</p>
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
    <product-tabs :reviews="reviews" :shipping="shipping" :details="details"></product-tabs>  
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
            reviews: [],
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
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity
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
            this.cart.pop(); //Метод pop() удаляет последний элемент из массива и возвращает удалённое значение.
        }
    },


})







 
 