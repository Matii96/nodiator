import { MediatorModule } from './mediator.module';

describe('MediatorModule', () => {
  it('should configure root sync', () => {
    expect(MediatorModule.forRoot({}).exports).toHaveLength(1);
  });

  it('should configure root async', () => {
    expect(MediatorModule.forRootAsync({}).exports).toHaveLength(1);
  });

  it('should configure feature sync', () => {
    expect(MediatorModule.forFeature(class {}, {}).exports).toHaveLength(1);
  });

  it('should configure feature async', () => {
    expect(MediatorModule.forFeatureAsync(class {}, {}).exports).toHaveLength(1);
  });
});
