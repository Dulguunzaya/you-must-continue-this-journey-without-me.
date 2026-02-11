import mongoose from 'mongoose';

const FIXED_PRICE_PER_HOUR = 20000;

const TableSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    status: {
        type: String,
        enum: ['AVAILABLE', 'PLAYING', 'DISABLED'],
        default: 'AVAILABLE'
    },
    pricePerHour: { type: Number, default: FIXED_PRICE_PER_HOUR, immutable: true }
}, { timestamps: true });

export { FIXED_PRICE_PER_HOUR };

const Table = mongoose.models.Table || mongoose.model('Table', TableSchema);

export default Table;
